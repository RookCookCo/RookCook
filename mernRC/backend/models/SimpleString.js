// models/SimpleString.js
const mongoose = require('mongoose');

const SimpleStringSchema = new mongoose.Schema({
    value: {
        type: String, // Single string value
        required: true
    }
});

module.exports = mongoose.model('SimpleString', SimpleStringSchema);