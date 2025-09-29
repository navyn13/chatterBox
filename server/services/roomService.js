const { Room } = require("../models");
const { AppError } = require("../middleware/error");

class RoomService {
  async createRoom(roomData) {
    const { roomId, name, ageGroup, theme } = roomData;

    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      throw new AppError('Room ID already exists', 400);
    }

    return await Room.create({
      roomId,
      name,
      ageGroup,
      theme,
    });
  }

  async getRoomsByTheme(theme) {
    const rooms = await Room.find({ theme });
    return rooms;
  }
}

module.exports = new RoomService();
