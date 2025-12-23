const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.get("/conversations", protect, chatController.getConversations);
router.post("/conversation", protect, chatController.getOrCreateConversation);
router.post("/message", protect, chatController.sendMessage);

router.get(
    "/messages/:conversationId",
    protect,
    chatController.getMessages
);

module.exports = router;
