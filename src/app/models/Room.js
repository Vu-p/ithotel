const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
    price: {type: String, required: true},
    image: [String],
    room_num: {type: String, required: true},
    status: {type: String, required: true, defaultValue: 'A'},
  }, { collection: 'room' });

module.exports = mongoose.model('Room', Room)
