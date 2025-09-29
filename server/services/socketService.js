const socketService = (io) => {
    io.on("connection", (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        socket.on('joinRoom', (roomID) => {
            socket.join(roomID);
            console.log(`📥 Socket ${socket.id} joined room ${roomID}`);
            socket.to(roomID).emit('userJoined', {
                userId: socket.id,
                message: 'A new user has joined the room'
            });
        });

        socket.on("send_msg", (data) => {
            console.log(`📤 Message in room ${data.room}: ${data.message}`);
            io.to(data.room).emit('receive_msg', {
                ...data,
                timestamp: new Date().toISOString()
            });
        });

        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });

        socket.on("error", (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });
};

module.exports = socketService;
