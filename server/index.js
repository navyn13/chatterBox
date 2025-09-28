// index.js (server side)

require('dotenv').config(); // only needed for local dev
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const routes = require('./routes/index');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL ,
  methods: ["GET", "POST"]
}));
app.use(bodyParser.json());
app.use('/', routes);

// HTTP + Socket.io server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI is not set! Check Railway dashboard.");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;

// Test route
app.get('/', (req, res) => {
  res.send("Hello from server 👋");
});

// Socket.io events
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('joinRoom', (roomID) => {
    socket.join(roomID);
    console.log(`📥 Socket ${socket.id} joined room ${roomID}`);
  });

  socket.on("send_msg", (data) => {
    console.log(`📤 Message in room ${data.room}: ${data.message}`);
    io.to(data.room).emit('recieve_msg', data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
