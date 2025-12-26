import React, { useState, useEffect, useContext } from 'react';
import { getMessages, sendMessage } from '../../api/chat.api';
import { getGroupConversationId } from '../../api/group.api';
import { ChatMessage } from '../../types/chat';
import { AuthContext } from '../../context/AuthContext';

interface GroupChatProps {
    groupId: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchConversationId = async () => {
            try {
                const response = await getGroupConversationId(groupId);
                // console.log(response)
                setConversationId(response.conversationId);
            } catch (error) {
                console.error(error);
            }
        };
        fetchConversationId();
    }, [groupId]);

    const fetchMessages = async () => {
        if (!conversationId) return;
        try {
            const response = await getMessages(conversationId);
            setMessages(response.data.messages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (conversationId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [conversationId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(newMessage)
        console.log(conversationId)
        if (!newMessage.trim() || !conversationId) return;
        try {
            await sendMessage(conversationId, newMessage);
            setNewMessage('');
            fetchMessages(); // Refresh messages after sending
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex mb-2 ${message.sender._id === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`p-2 rounded-lg ${message.sender._id === userId ? 'bg-blue-500 text-white' : 'bg-gray-300'
                                }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs text-right mt-1">{new Date(message.createdAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow p-2 border rounded-l-md"
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-md">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GroupChat;

