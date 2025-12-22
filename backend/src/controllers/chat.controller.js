const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// 1️⃣ Create or get conversation
exports.getOrCreateConversation = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, userId],
            });
        }

        res.status(200).json({ conversationId: conversation._id });
    } catch (error) {
        next(error);
    }
};

// 2️⃣ Send message
exports.sendMessage = async (req, res, next) => {
    try {
        const { conversationId, text } = req.body;

        if (!conversationId || !text) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            text,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
        });

        res.status(201).json({ message: "Message sent" });
    } catch (error) {
        next(error);
    }
};

// 3️⃣ Get messages (polling)
exports.getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversation: conversationId })
            .populate("sender", "email")
            .sort({ createdAt: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        next(error);
    }
};
