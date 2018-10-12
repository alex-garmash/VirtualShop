const mongoose = require('mongoose');

const ShoppingcartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ShoppingCart',ShoppingcartSchema);