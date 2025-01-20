import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from 'react-icons/ti';

interface Chat {
    id: string;
    receiver: {
        id: string;
        username: string;
        email: string;
        role: string;
    };
    lastMessage: string;
    lastMessageTime: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

const Chats: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [trainers, setTrainers] = useState<User[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<string>('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);

    const handleArrowBack = () => {
        navigate('/home');
    };

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
        const fetchChats = async () => {
            try {
                const response = await fetch(`http://localhost:8081/chats?userId=${userId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setChats(data);
                } else {
                    console.error('Failed to fetch chats');
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        const fetchTrainers = async () => {
            try {
                const response = await fetch(`http://localhost:8081/chats/trainers?userId=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setTrainers(data);
                } else {
                    console.error('Failed to fetch trainers');
                }
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };

        if (userId) {
            fetchChats();
            fetchTrainers();
        }
    }, [userId]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8081/ws');

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setChats((prevChats) => {
                const updatedChats = prevChats.map(chat =>
                    chat.id === newMessage.chatId
                        ? { ...chat, lastMessage: newMessage.text, lastMessageTime: newMessage.time }
                        : chat
                );
                return updatedChats;
            });
            alert(`New message from ${newMessage.trainerName}: ${newMessage.text}`);
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleStartChat = async () => {
        if (!selectedTrainer) {
            alert('Please select a trainer to start a chat.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/chats/start?userId=${userId}&trainerId=${selectedTrainer}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                const newChat = await response.json();
                setChats([...chats, newChat]);
                setSelectedTrainer('');
                navigate(`/chat/${newChat.id}`);
            } else {
                console.error('Failed to start chat');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const handleChatClick = (chatId: string) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack}/>
            </div>
            <h1 className="text-5xl font-bold text-white mb-8">Chats</h1>
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4 flex flex-col sm:flex-row items-center">
                    <select
                        value={selectedTrainer}
                        onChange={(e) => setSelectedTrainer(e.target.value)}
                        className="w-full sm:w-2/3 p-2 border rounded-lg mb-2 sm:mb-0 sm:mr-2"
                    >
                        <option value="">Select a trainer to start a chat</option>
                        {trainers.map(trainer => (
                            <option key={trainer.id} value={trainer.id}>{trainer.username}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleStartChat}
                        className="w-full sm:w-1/3 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    >
                        Start Chat
                    </button>
                </div>
                {chats.length === 0 ? (
                    <p className="text-gray-400 text-center">No chats available.</p>
                ) : (
                    <div className="space-y-4">
                        {chats.map(chat => (
                            <div
                                key={chat.id}
                                className="p-4 border rounded-lg bg-gray-100 shadow-inner cursor-pointer hover:bg-gray-200 transition"
                                onClick={() => handleChatClick(chat.id)}
                            >
                                <h2 className="text-2xl font-bold mb-1">{chat.receiver.username}</h2>
                                <p className="text-gray-700 mb-1">{chat.lastMessage}</p>
                                <p className="text-gray-500 text-sm">{chat.lastMessageTime}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chats;