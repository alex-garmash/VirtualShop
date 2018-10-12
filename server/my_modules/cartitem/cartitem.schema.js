const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    amount: {
        type: Number,
        required: [true,'amount required']
    },
    total_price: {
        type: Number,
        required: [true,'total price required']
    },
   shopping_cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingCart'
    }
});

module.exports = mongoose.model('CartItem',CartItemSchema);