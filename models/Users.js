const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firebase: {
        type: String,
        unique: true,
    },
    counter: {
        type: Number,
    },
    // lastCycle: {
    //     type: Date,
    //     default: Date.now,
    // }
})

module.exports = mongoose.model('User', UserSchema)