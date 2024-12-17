const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    created_at: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Customer', Customer);