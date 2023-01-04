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
    s3_url: {
        type: String,
    },
    category: {
        type: String,
    }
    
}, {timestamps: true});


module.exports = mongoose.model('Exchange', ExchangeSchema);