import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
    senderId: string;
    recipientId: string;
    content: string;
}

function ChatPage() {
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData.userID);
                    fetchMessages(userData.userID);
                    connectWebSocket();
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        const fetchMessages = async (userId: string) => {
            try {
                const response = await fetch(`http://localhost:8081/messages/${userId}/${chatId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const connectWebSocket = () => {
            const ws = new WebSocket('ws://localhost:8081/ws');
            ws.onmessage = (event) => {
                const message: Message = JSON.parse(event.data);
                setMessages((prev) => [...prev, message]);
            };
            setSocket(ws);
        };

        fetchUserId();
    }, [chatId]);

    const sendMessage = () => {
        if (socket && newMessage.trim() !== '' && chatId) {
            const message: Message = { senderId: userId!, recipientId: chatId, content: newMessage };
            socket.send(JSON.stringify(message));
            setMessages((prev) => [...prev, message]);
            setNewMessage('');
        }
    };

    return (
        <div className="p-4 bg-gray-800 min-h-screen text-white flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Chat</h1>
            <div className="flex-grow overflow-y-auto border-b border-gray-600 p-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}>{msg.content}</div>
                ))}
            </div>
            <div className="flex mt-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 text-black"
                />
                <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500">Send</button>
            </div>
        </div>
    );
}

export default ChatPage;