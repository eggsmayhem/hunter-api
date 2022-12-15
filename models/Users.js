const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firebase: {
        type: String,
    },
    counter: {
        type: Number,
    },
    lastDate: {
        type: Date,
    },
    email: {
        type: String,
    }
})

module.exports = mongoose.model('User', UserSchema)