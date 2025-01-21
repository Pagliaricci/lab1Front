import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";


interface User {
    id: string;
    username: string;
}

interface Chat {
    id: string;
    user2: User;
}

const Chats = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const navigate = useNavigate();
    
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
        if (userId) {
            fetch(`http://localhost:8081/chats?userId=${userId}`)
                .then((res) => res.json())
                .then(setChats);

            fetch("http://localhost:8081/users")
                .then((res) => res.json())
                .then(setUsers);
        }
    }, [userId]);

    const startChat = () => {
        fetch(`http://localhost:8081/chats?user1Id=${userId}&user2Id=${selectedUser}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((newChat) => navigate(`/chat/${newChat.id}`));
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={handleArrowBack}/>
            </div>
            <h1 className="text-2xl font-bold mb-4">Chats</h1>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id} className="p-2 border-b" onClick={() => navigate(`/chat/${chat.id}`)}>
                        Chat with User {chat.user2.username}
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="border p-2">
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
                <button onClick={startChat} className="ml-2 bg-blue-500 text-white px-4 py-2">Start Chat</button>
            </div>
        </div>
    );
};

export default Chats;