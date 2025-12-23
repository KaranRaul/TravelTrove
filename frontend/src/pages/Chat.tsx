import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import {
    getUsers,
    getOrCreateConversation,
    getMessages,
    sendMessage,
} from "../api/chat.api";
import { ChatUser, ChatMessage } from "../types/chat";

const Chat = () => {
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");

    // Load users
    useEffect(() => {
        getUsers().then((res) => setUsers(res.data.users));
    }, []);

    // Poll messages
    useEffect(() => {
        if (!conversationId) return;

        const load = async () => {
            const res = await getMessages(conversationId);
            setMessages(res.data.messages);
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    const selectUser = async (user: ChatUser) => {
        setSelectedUser(user);
        const res = await getOrCreateConversation(user._id);
        setConversationId(res.data.conversationId);
    };

    const handleSend = async () => {
        if (!text.trim() || !conversationId) return;
        await sendMessage(conversationId, text);
        setText("");
        const res = await getMessages(conversationId);
        setMessages(res.data.messages);
    };

    return (
        <Layout>
            <div className="h-[80vh] bg-white shadow rounded-lg flex overflow-hidden">

                {/* LEFT SIDEBAR */}
                <div className="w-1/3 border-r p-4">
                    <input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border rounded-md"
                    />

                    <div className="space-y-2 overflow-y-auto h-full">
                        {users
                            .filter((u) =>
                                u.email.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => selectUser(user)}
                                    className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${selectedUser?._id === user._id ? "bg-gray-200" : ""
                                        }`}
                                >
                                    {user.email}
                                </div>
                            ))}
                    </div>
                </div>

                {/* RIGHT CHAT WINDOW */}
                <div className="w-2/3 flex flex-col">
                    {!selectedUser ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a user to start chatting
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b font-semibold">
                                {selectedUser.email}
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {messages.map((m) => (
                                    <div
                                        key={m._id}
                                        className={`max-w-xs px-4 py-2 rounded-lg ${m.sender.email === selectedUser.email
                                                ? "bg-gray-200"
                                                : "bg-blue-600 text-white ml-auto"
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t flex gap-2">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 border rounded-md"
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Chat;
