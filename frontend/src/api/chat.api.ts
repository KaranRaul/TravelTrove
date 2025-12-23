import api from "./axios";

export const getUsers = () => {
    return api.get("/users");
};

export const getOrCreateConversation = (userId: string) => {
    return api.post("/chat/conversation", { userId });
};

export const getMessages = (conversationId: string) => {
    return api.get(`/chat/messages/${conversationId}`);
};

export const sendMessage = (conversationId: string, text: string) => {
    return api.post("/chat/message", { conversationId, text });
};
