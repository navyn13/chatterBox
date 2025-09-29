const { catchAsync } = require("../../middleware/error");
const { AppError } = require("../../middleware/error");
const s3Service = require("../../services/s3Service");
const { handleUpload } = require('../../middleware/upload');

exports.uploadProfilePic = handleUpload;

exports.setProfilePic = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${req.file.originalname}`;
  const imgAddress = await s3Service.uploadToS3(req.file, uniqueName);
  
  res.status(200).json({ 
    success: true, 
    pfp: imgAddress 
  });
});
