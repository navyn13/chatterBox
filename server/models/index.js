const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    imgAddress:String,
})
const roomSchema = new Schema({
    roomId: String,
    name:String,
    ageGroup:String,
    theme:String,
})
exports.User = mongoose.model('User', userSchema);
exports.Room = mongoose.model('Room', roomSchema);