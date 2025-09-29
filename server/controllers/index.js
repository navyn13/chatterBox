const authController = require('./auth/authController');
const profileController = require('./auth/profileController');
const roomController = require('./rooms/roomController');

module.exports = {
  ...authController,
  ...profileController,
  ...roomController
};