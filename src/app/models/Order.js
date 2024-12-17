const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
  })

module.exports = mongoose.model('Order', Order)