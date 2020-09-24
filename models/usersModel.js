const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    userName: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: {type: Boolean, required: true},
});

module.exports = mongoose.model('usersModel', usersSchema);