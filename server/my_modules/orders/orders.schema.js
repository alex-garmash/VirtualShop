const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({

    shopping_cart: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'shopping cart id required'],
        ref: "ShoppingCart"
    },
    total_amount: {
        type: Number,
        required: [true,'total amount required'],
        default: 0
    },
    send_date:{
        type: Date,
        required: [true,'send date required']
    },
    ordered_date: {
        type: Date,
        default: new Date()
    },
    credit_card: {
        type: String,
        required: [true,'credit card required'],
    }
});

module.exports = mongoose.model('Orders',OrdersSchema);