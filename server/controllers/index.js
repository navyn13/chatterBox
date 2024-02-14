const model = require("../models/index");
const User = model.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now()
    cb(null, uniquePrefix + ' ' + file.originalname)
  }
})

const upload = multer({ storage: storage })

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAW3MEED3GFSKD7MM5",
    secretAccessKey: "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"
  }
})

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: 'streamvistabucket',
    Key: key,
  })
  const url = await getSignedUrl(s3Client, command)
  return url;
}

async function putObject(filename, contentType) {
  const command = new PutObjectCommand({
    Bucket: 'streamvistabucket',
    Key: `/uploads/user-uploads/${filename}`,
    ContentType: contentType
  })
  const url = await getSignedUrl(s3Client, command)
  return url;
}


exports.signup = async (req, res) => {
  try {
    const { username, email, password, imgAddress } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already in use" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      imgAddress,
    });
    await newUser.save();
    const token = jwt.sign({ username, email }, "secret_key");
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      var token = jwt.sign({ email: user.email, username: user.username }, "secret_key");
      res.json({ success: true, message: "Correct Credentials", token: token, user: user });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.watch = async (req, res) => {
  console.log(req.query);
  res.sendStatus(200).json({ message: 'req aai thi' })
}

exports.uploadProfilePic = upload.single('image')



exports.setProfilePic = async (req, res) => {
  try {
    console.log(req.file)
    const uniqueName = Date.now() + ".jpeg" 
    const uploadingUrl  = await putObject(uniqueName, 'image/jpeg');
    const imageData = fs.readFileSync(req.file.path);

    const imgUrl = await fetch(uploadingUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: imageData
    })
    
    const imgAddress = await getObjectURL("/uploads/user-uploads/"+ uniqueName)
    console.log(imgAddress)
    res.status(200).send({ pfp: imgAddress});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
