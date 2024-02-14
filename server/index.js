const express = require('express');
const app = express()
const routes = require('./routes/index');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);


const server = createServer(app);
const io = new Server(server, {
  cors:{
    origin:'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});


mongoose.connect('mongodb+srv://navyn13102003:reliance@cluster0.em2erl6.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on('joinRoom', (roomID) => {
    socket.join(roomID);
  });

  socket.on("send_msg", (data)=>{
    io.to(data.room).emit('recieve_msg', data);
  })
})


server.listen(4000, () => {
    console.log(`Server is running on port 4000}`);
  });

