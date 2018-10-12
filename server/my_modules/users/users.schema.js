const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true,'name required']
    },
    last_name: {
        type: String,
        required: [true,'last name required']
    },
    email: {
        type: String,
        required: [true,'email required']
    },
    ID: {
        type: String,
        required: [true,'ID required']
    },
    hash: {
        type: String,
        required: [true,'password required']
    },
    role: {
        type: String,
        //required: [true,'role required']
         default: 'User'
    },
    city: {
        type: String,
        required: [true,'city required']
        // default: null
    },
    street: {
        type: String,
        required: [true,'street required']
        // default: null
    }
});

module.exports = mongoose.model('Users',UsersSchema);