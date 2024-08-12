const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    preferences: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Preference', PreferenceSchema);