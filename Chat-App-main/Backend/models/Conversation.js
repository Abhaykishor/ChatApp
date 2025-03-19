const mongoose = require('mongoose');

// Define message schema
const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl : {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    msgByUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    }
}, {
    timestamps: true
});

const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    },
    message: [{
        type: mongoose.Schema.ObjectId,
        ref: "Message"
    }]
}, {
    timestamps: true
});

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Conversation, Message };
