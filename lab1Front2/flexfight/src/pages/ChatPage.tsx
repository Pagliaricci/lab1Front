import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

interface Message {
    id: string;
    senderId: string;
    content: string;
    time: string;
}

const Chat = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const handleArrowBack = () => {
        navigate('/chats');
    };

    useEffect(() => {
        fetch(`http://localhost:8081/messages/${chatId}`)
            .then((res) => res.json())
            .then(setMessages)
            .catch((err) => console.error("Error fetching messages:", err));

        const ws = new WebSocket(`ws://localhost:8081/ws`);
        ws.onopen = () => ws.send(JSON.stringify({ chatId }));
        ws.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };
        ws.onerror = (error) => console.error("WebSocket error:", error);
        ws.onclose = () => console.log("WebSocket disconnected");
        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            const messageObj = { chatId, senderId: "1", content: newMessage };
            fetch("http://localhost:8081/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageObj),
            })
                .catch((err) => console.error("Error sending message:", err));
            socket.send(JSON.stringify(messageObj));
            setNewMessage("");
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack}/>
            </div>
            <h1 className="text-2xl font-bold mb-4">Chat {chatId}</h1>
            <div className="border p-4 h-80 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>User {msg.senderId}:</strong> {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="border p-2 flex-1"
                />
                <button
                    onClick={sendMessage}
                    className={`ml-2 px-4 py-2 text-white ${newMessage.trim() ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;