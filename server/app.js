
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { errorHandler } = require('./middleware/error');

const routes = require('./routes');

const config = require('./config/config');

const socketService = require('./services/socketService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: config.cors || {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});




// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send("Hello from StreamVista server 👋");
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});



// Initialize Socket.io service
socketService(io);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = { app, server, io };
