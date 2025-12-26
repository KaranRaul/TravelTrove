const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Group = require("../models/Group");

// GET ALL CONVERSATIONS FOR A USER
exports.getConversations = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id,
        })
            .populate("participants", "username email")
            .populate({
                path: 'group',
                populate: {
                    path: 'members',
                    select: 'username email'
                }
            })
            .sort({ lastMessageAt: -1 });

        res.status(200).json({ conversations });
    } catch (error) {
        next(error);
    }
};

// 1️⃣ Create or get conversation
exports.getOrCreateConversation = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] },
            type: 'direct'
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

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        if (conversation.type === 'group') {
            const group = await Group.findById(conversation.group);
            if (!group.members.includes(req.user._id)) {
                return res.status(403).json({ error: "You are not a member of this group" });
            }
        } else {
            if (!conversation.participants.includes(req.user._id)) {
                return res.status(403).json({ error: "You are not a participant in this conversation" });
            }
        }


        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            text,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            lastMessageAt: Date.now(),
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

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        if (conversation.type === 'group') {
            const group = await Group.findById(conversation.group);
            if (!group.members.includes(req.user._id)) {
                return res.status(403).json({ error: "You are not a member of this group" });
            }
        } else {
            if (!conversation.participants.includes(req.user._id)) {
                return res.status(403).json({ error: "You are not a participant in this conversation" });
            }
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate("sender", "username email")
            .sort({ createdAt: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        next(error);
    }
};

