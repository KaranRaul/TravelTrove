import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import {
    getConversations,
    getMessages,
    sendMessage,
    getOrCreateConversation,
} from "../api/chat.api";
import { getAllUsers } from "../api/user.api";
import { ChatUser, ChatMessage, Conversation } from "../types/chat";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

const Chat = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const currentUser: DecodedToken | null = token ? jwtDecode(token) : null;
    const location = useLocation();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
    const [search, setSearch] = useState("");
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");

    const selectedConversation = conversations.find(c => c._id === selectedConversationId) || null;

    const fetchConversations = () => {
        return getConversations().then((res) => {
            setConversations(res.data.conversations);
            return res.data.conversations;
        });
    };

    // Handle initial state from navigation
    useEffect(() => {
        if (location.state?.conversationId) {
            setSelectedConversationId(location.state.conversationId);
        }
    }, [location.state]);

    // Load conversations and all users
    useEffect(() => {
        fetchConversations();
        getAllUsers().then((res) => setAllUsers(res.data.users));
    }, []);


    // Poll messages
    useEffect(() => {
        if (!selectedConversationId) return;

        const load = async () => {
            const res = await getMessages(selectedConversationId);
            setMessages(res.data.messages);
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [selectedConversationId]);

    const selectConversation = (c: Conversation) => {
        setSelectedConversationId(c._id);
    };

    const handleSelectUser = async (user: ChatUser) => {
        try {
            const res = await getOrCreateConversation(user._id);
            const convId = res.data.conversationId;

            const updatedConversations = await fetchConversations();
            const conversationExists = updatedConversations.some((c: Conversation) => c._id === convId);

            if (conversationExists) {
                setSelectedConversationId(convId);
            } else {
                // If it's a new conversation, it might not appear immediately.
                // We can add it manually or just rely on the next fetch.
                // For now, just selecting it.
                setSelectedConversationId(convId);
            }

            navigate('/chat', { replace: true, state: {} }); // Clear location state
        } catch (error) {
            console.error("Error creating or getting conversation:", error);
        }
    };

    const handleSend = async () => {
        if (!text.trim() || !selectedConversationId) return;
        await sendMessage(selectedConversationId, text);
        setText("");
        const res = await getMessages(selectedConversationId);
        setMessages(res.data.messages);

        // Refresh conversations to get the latest message on top
        fetchConversations();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getOtherParticipant = (c: Conversation) => {
        return c.participants.find((p: ChatUser) => p._id !== currentUser?.id);
    };

    const filteredConversations = conversations.filter((c) => {
        const otherUser = getOtherParticipant(c);
        return otherUser?.email.toLowerCase().includes(search.toLowerCase());
    });

    const filteredUsers = allUsers.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="h-[calc(100vh-150px)] bg-white border border-gray-200 rounded-lg flex overflow-hidden">
                    {/* LEFT SIDEBAR */}
                    <div className="w-80 border-r border-gray-200 flex flex-col">
                        {/* Search Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    placeholder="Search users or messages..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* User & Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {/* All Users */}
                            <div className="p-4">
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    All Users
                                </h2>
                                <div className="space-y-1">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <div
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className="px-2 py-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs">
                                                        {user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 px-2">No users found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="px-4 py-2">
                                <div className="border-t border-gray-200"></div>
                            </div>

                            {/* Conversations */}
                            <div className="p-4">
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Messages
                                </h2>
                                {filteredConversations.length === 0 ? (
                                    <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                                        No conversations found
                                    </div>
                                ) : (
                                    filteredConversations.map((c) => {
                                        const otherUser = getOtherParticipant(c);
                                        if (!otherUser) return null;
                                        return (
                                            <div
                                                key={c._id}
                                                onClick={() => selectConversation(c)}
                                                className={`px-2 py-2 cursor-pointer rounded-lg transition-colors ${selectedConversationId === c._id
                                                        ? "bg-gray-100"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium text-xs">
                                                        {otherUser.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {otherUser.email}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {c.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CHAT WINDOW */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {!selectedConversation ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg
                                    className="w-20 h-20 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <p className="text-sm font-medium">
                                    Select a conversation to start messaging
                                </p>
                            </div>
                        ) : (
                            (() => {
                                const otherUser = getOtherParticipant(selectedConversation);
                                if (!otherUser) return null;
                                return (
                                    <>
                                        {/* Chat Header */}
                                        <div className="px-6 py-4 bg-white border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                                                    {otherUser.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {otherUser.email}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages Area */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                            {messages.length === 0 ? (
                                                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                                    No messages yet. Start the conversation!
                                                </div>
                                            ) : (
                                                messages.map((m) => (
                                                    <div
                                                        key={m._id}
                                                        className={`flex ${m.sender._id === otherUser._id
                                                                ? "justify-start"
                                                                : "justify-end"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`max-w-sm px-4 py-2 rounded-2xl text-sm ${m.sender._id === otherUser._id
                                                                    ? "bg-white border border-gray-200 text-gray-900"
                                                                    : "bg-gray-900 text-white"
                                                                }`}
                                                        >
                                                            {m.text}
                                                        </div>
													</div>
                                                ))
                                            )}
                                        </div>

                                        {/* Message Input */}
                                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                                            <div className="flex gap-3 items-end">
                                                <input
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Type a message..."
                                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all resize-none"
                                                />
                                                <button
                                                    onClick={handleSend}
                                                    disabled={!text.trim()}
                                                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Chat;
