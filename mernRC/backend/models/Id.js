const mongoose = require('mongoose');

const IdSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Id', IdSchema);