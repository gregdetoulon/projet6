const mongoose = require('mongoose');

const witSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isValid: {type: Boolean, required: true},
  Likes: {type:[Object]},
  comment: {
    type:[Object], 
    userName: String, 
    comment: String, 
    date: Date, default: Date.now()}
});

module.exports = mongoose.model('witsModel', witSchema);