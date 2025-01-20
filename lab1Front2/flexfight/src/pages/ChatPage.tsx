import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
}

interface User {
    id: string;
    username: string;
}

const ChatPage: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [receiver, setReceiver] = useState<User | null>(null);

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
                } else {
                    console.error('Failed to fetch user ID');
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8081/chats/${chatId}/messages`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const response = await fetch(`http://localhost:8081/chats/${chatId}/receiver`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setReceiver(data);
                } else {
                    console.error('Failed to fetch receiver');
                }
            } catch (error) {
                console.error('Error fetching receiver:', error);
            }
        };

        fetchReceiver();
    }, [chatId]);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8081/ws/${chatId}`);

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        return () => {
            ws.close();
        };
    }, [chatId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/chats/${chatId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, text: newMessage }),
            });

            if (response.ok) {
                setNewMessage('');
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={() => window.history.back()} />
            </div>
            <h1 className="text-5xl font-bold text-white mb-8">Chat with {receiver?.username}</h1>
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`mb-2 ${message.sender === userId ? 'text-right' : 'text-left'}`}>
                            <div className={`text-sm ${message.sender === userId ? 'text-blue-500' : 'text-gray-500'}`}>
                                {message.sender === userId ? 'You' : receiver?.username}
                            </div>
                            <div className={`text-lg ${message.sender === userId ? 'bg-blue-100' : 'bg-gray-100'} p-2 rounded-lg inline-block`}>
                                {message.text}
                            </div>
                            <div className="text-xs text-gray-400">{message.time}</div>
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="ml-2 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;