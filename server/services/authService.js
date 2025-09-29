const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AppError } = require("../middleware/error");

class AuthService {
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
  }

  async createUser(userData) {
    const { username, email, password, imgAddress } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email is already in use', 400);
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      imgAddress,
    });

    return {
      id: user._id,
      username: user.username,
      email: user.email
    };
  }

  async validateUser(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new AppError('Invalid credentials', 401);
    }
    return user;
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      imgAddress: user.imgAddress
    };
  }
}

module.exports = new AuthService();
