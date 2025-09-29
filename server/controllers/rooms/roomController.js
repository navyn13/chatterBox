const { catchAsync } = require("../../middleware/error");
const { AppError } = require("../../middleware/error");
const roomService = require("../../services/roomService");

exports.createRoom = catchAsync(async (req, res) => {
  const { roomId, name, ageGroup, theme } = req.body;

  if (!roomId || !name || !ageGroup || !theme) {
    throw new AppError('Please provide all required fields', 400);
  }

  const room = await roomService.createRoom({ roomId, name, ageGroup, theme });

  res.status(201).json({ 
    success: true, 
    message: "Room created successfully",
    room
  });
});

exports.getRooms = catchAsync(async (req, res) => {
  const { theme } = req.query;

  if (!theme) {
    throw new AppError('Theme parameter is required', 400);
  }

  const rooms = await roomService.getRoomsByTheme(theme);
  
  res.status(200).json({ 
    success: true, 
    count: rooms.length,
    rooms
  });
});

exports.watch = catchAsync(async (req, res) => {
  // Implement your watch logic here
  res.status(200).json({ success: true, message: 'Watch request received' });
});
