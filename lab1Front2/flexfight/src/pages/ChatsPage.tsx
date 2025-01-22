import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

interface Message {
    senderId: string;
    content: string;
}

const ChatsPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [users, setUsers] = useState<{ id: string; participantName: string }[]>([]);
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);
    const nickname = localStorage.getItem('nickname') || '';
    const fullname = localStorage.getItem('fullname') || '';
    const navigate = useNavigate();

    useEffect(() => {
        const socket = new SockJS('http://localhost:8081/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
            stompClient.subscribe(`/user/public`, onMessageReceived);
            stompClient.send('/app/user.addUser', {}, JSON.stringify({ nickName: nickname, fullName: fullname, status: 'ONLINE' }));
        }, onError);
        stompClientRef.current = stompClient;

        return () => {
            stompClient.disconnect(() => {
                stompClient.send('/app/user.disconnectUser', {}, JSON.stringify({ nickName: nickname, fullName: fullname, status: 'OFFLINE' }));
            });
        };
    }, [nickname, fullname]);

    const onMessageReceived = (payload: any) => {
        const message = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, message]);
        chatAreaRef.current?.scrollTo(0, chatAreaRef.current.scrollHeight);
    };

    const onError = () => {
        console.error('Could not connect to WebSocket server. Please refresh this page to try again!');
    };

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        if (newMessage.trim() && stompClientRef.current && selectedUser) {
            const chatMessage = {
                senderId: nickname,
                recipientId: selectedUser,
                content: newMessage,
                timestamp: new Date(),
            };
            stompClientRef.current.publish({ destination: '/app/chat', body: JSON.stringify(chatMessage) });
            setMessages((prevMessages) => [...prevMessages, chatMessage]);
            setNewMessage('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('nickname');
        localStorage.removeItem('fullname');
        navigate('/');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:8081/users');
            const data = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold mb-4">Online Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} onClick={() => setSelectedUser(user.id)} className="flex items-center p-2 cursor-pointer hover:bg-gray-200">
                            <img src="../img/user_icon.png" alt={user.participantName} className="w-10 h-10 rounded-full mr-2" />
                            <span>{user.participantName}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 overflow-y-auto p-4" ref={chatAreaRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded ${msg.senderId === nickname ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex p-4 border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Send</button>
            </form>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">Logout</button>
        </div>
    );
};

export default ChatsPage;