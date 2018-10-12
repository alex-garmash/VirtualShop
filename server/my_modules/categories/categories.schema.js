const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'name required'],
        index: true
    }
});

module.exports = mongoose.model('Categories',CategoriesSchema);