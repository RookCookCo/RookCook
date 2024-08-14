// models/UserProfilePic.js
const mongoose = require('mongoose');

const UserProfilePicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ensure each user can only have one profile picture
    },
    imageData: {
        type: String, // Store the image data as a base64 string
        required: true
    }
});

module.exports = mongoose.model('UserProfilePic', UserProfilePicSchema);
