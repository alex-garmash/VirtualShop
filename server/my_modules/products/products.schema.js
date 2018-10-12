const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'products name required']
    },
    price: {
        type: Number,
        required: [true,'products price required']
    },
    url_img: {
        type: String,
        required: [true,'products url image required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }
});

module.exports = mongoose.model('Products',ProductsSchema);