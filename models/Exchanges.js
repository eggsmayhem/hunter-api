const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
    firebase: {
        type: String,
    },
    userSpeech: {
        type: String,
    },
    hunterSpeech: {
        type: String,
    },
});

module.exports = mongoose.model('Exchange', ExchangeSchema);