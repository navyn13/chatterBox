const { catchAsync } = require("../../middleware/error");
const { AppError } = require("../../middleware/error");
const authService = require("../../services/authService");
const jwt = require('jsonwebtoken');
const User = require('../../models/index');

exports.verifyToken = catchAsync(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const userResponse = authService.sanitizeUser(user);

    res.json({
        success: true,
        user: userResponse
    });
});

exports.signup = catchAsync(async (req, res) => {
  const { username, email, password, imgAddress } = req.body;
  
  if (!username || !email || !password) {
    throw new AppError('Please provide all required fields', 400);
  }

  const user = await authService.createUser({ username, email, password, imgAddress });
  const token = authService.generateToken({ username, email });

  res.status(201).json({ 
    success: true, 
    token,
    user
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await authService.validateUser(email, password);
  const token = authService.generateToken({ 
    id: user._id, 
    email: user.email, 
    username: user.username 
  });

  const userResponse = authService.sanitizeUser(user);

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: userResponse
  });
});
