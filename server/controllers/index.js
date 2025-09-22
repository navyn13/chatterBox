const model = require("../models/index");
const User = model.User;
const Room = model.Room;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require('fs');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
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
  console.log(req.body)
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
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpeg`;
    const key = `uploads/user-uploads/${uniqueName}`;

    const params = {
      Bucket: 'streamvistabucket',
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const imgAddress = await getObjectURL(key);
    res.status(200).send({ pfp: imgAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomId, name, ageGroup, theme } = req.body;
    const newRoom = new Room({
      roomId,
      name,
      ageGroup,
      theme,
    });
    await newRoom.save();
    res.status(200).json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getRooms = async (req, res) => {
  console.log("getroom called")
  console.log(req.query)
  try {
    const roomsData = await Room.find({ theme: req.query.theme });
    res.status(200).json({ success: true, roomsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};