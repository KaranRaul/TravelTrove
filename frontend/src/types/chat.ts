export interface ChatUser {
    _id: string;
    email: string;
}

export interface ChatMessage {
    _id: string;
    text: string;
    sender: {
        _id: string;
        email: string;
    };
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: ChatUser[];
    lastMessage: string;
    lastMessageAt: string;
}
