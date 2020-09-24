const mongoose = require('mongoose');

const witSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isValid: {type: Boolean, required: true},
});

module.exports = mongoose.model('witsModel', witSchema);