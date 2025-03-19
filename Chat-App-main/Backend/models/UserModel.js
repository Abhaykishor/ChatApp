const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "Provide email"]
    },
    password: { 
        type: String,
        required: [true, "Provide Password"]
    },
    profile_pic: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;