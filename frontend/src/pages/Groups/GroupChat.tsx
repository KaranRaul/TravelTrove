import React, { useState, useEffect, useContext, useRef } from 'react';
import { getMessages, sendMessage } from '../../api/chat.api';
import { getGroupConversationId } from '../../api/group.api';
import { ChatMessage } from '../../types/chat';
import { AuthContext } from '../../context/AuthContext';
import { linkifyText } from '../../utils/linkify-text';

interface GroupChatProps {
    groupId: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { userId } = useContext(AuthContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchConversationId = async () => {
            try {
                const response = await getGroupConversationId(groupId);
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
        if (!newMessage.trim() || !conversationId) return;
        try {
            await sendMessage(conversationId, newMessage);
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    };

    return (
        <div className="flex flex-col h-[500px] lg:h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg
                            className="w-12 h-12 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.sender._id === userId;
                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white border border-gray-200 text-gray-900'
                                        }`}
                                >
                                    <p className="text-xs font-semibold mb-1 opacity-75">
                                        {message.sender.username || message.sender.email}
                                    </p>
                                    <div
                                        className={`text-sm break-words ${isOwnMessage
                                                ? '[&_a]:text-blue-300 [&_a]:hover:text-blue-200 [&_a]:underline'
                                                : '[&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: linkifyText(message.text) }}
                                    />
                                    <p className="text-xs opacity-60 text-right mt-1">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GroupChat;
