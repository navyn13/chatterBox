// index.js
require('dotenv').config(); // only needed for local dev
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { join } = require('path');
const routes = require('./routes/index');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);

// Socket.io setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
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

// Serve a simple route
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

// Socket.io events
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('joinRoom', (roomID) => {
    socket.join(roomID);
  });

  socket.on("send_msg", (data) => {
    io.to(data.room).emit('recieve_msg', data);
  });
});

// Port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
