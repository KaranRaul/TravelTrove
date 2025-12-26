const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['direct', 'group'],
            default: 'direct',
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: {
            type: String,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
