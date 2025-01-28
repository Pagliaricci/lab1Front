import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";

interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: number;
}

const ChatPage = () => {
    const { recipientId } = useParams<{ recipientId: string }>(); // Get recipientId from URL
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();
    const socket = new WebSocket(`ws://localhost:8081/ws?${userId}`);

    // Function to fetch the current logged-in user ID
    const fetchUserId = async () => {
        try {
            const response = await fetch("http://localhost:8081/users/me", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                setUserId(userData.userID);
            } else {
                console.error("Failed to fetch user ID");
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId || !recipientId) return;
        try {
            const fetchMessages = async () => {
                const response = await fetch(`http://localhost:8081/chats/getMessages/${userId}&${recipientId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            };
            fetchMessages();
        }
        catch (error) {
            console.error("Error fetching messages:", error);
        }

    }, [userId, recipientId]);

    const handleSendMessage = () => {
        const formattedMessage = `${recipientId}:${message}`;
        socket.send(formattedMessage);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={() => navigate("/chats")} />
            </div>
            <h1 className="text-xl font-bold mb-4">Chat</h1>

            <div className="space-y-3 max-h-[400px] overflow-auto p-2 border rounded-lg bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`p-3 rounded-lg max-w-xs ${msg.senderId === userId ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex">
                <input
                    className="border p-2 flex-1 rounded-l-lg"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 rounded-r-lg"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;