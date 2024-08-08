const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        type: String,
    }]
});

module.exports = mongoose.model('Inventory', InventorySchema);
