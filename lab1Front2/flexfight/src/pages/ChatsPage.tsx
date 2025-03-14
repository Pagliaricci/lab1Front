import { useEffect, useState } from "react";
                import { useNavigate } from "react-router-dom";
                import { TiArrowBackOutline } from "react-icons/ti";
                
                interface Chat {
                    id: string;
                    user1Name: string;
                    user2Name: string;
                }
                
                interface User {
                    id: string;
                    username: string;
                    role: string;
                }
                
                const ChatsPage = () => {
                    const [chats, setChats] = useState<Chat[]>([]);
                    const [users, setUsers] = useState<User[]>([]);
                    const [showUsers, setShowUsers] = useState(false);
                    const [userId, setUserId] = useState<string | null>(null);
                    const [username, setUsername] = useState<string | null>(null);
                    const [role, setRole] = useState<string | null>(null);
                    const navigate = useNavigate();
                
                    useEffect(() => {
                        const fetchChats = async () => {
                            if (!userId) return; // Ensure userId is available
                            try {
                                const response = await fetch(`http://localhost:8081/chats/get/${userId}`);
                                if (response.ok) {
                                    const data = await response.json();
                                    console.log(data);
                                    setChats(data);
                                } else {
                                    console.error("Failed to fetch chats:", response.statusText);
                                }
                            } catch (error) {
                                console.error("Error fetching chats:", error);
                            }
                        };
                
                        fetchUserId().then(fetchChats); // Ensure fetchUserId is called before fetchChats
                    }, [userId]);
                
                    const fetchUserId = async () => {
                        try {
                            const response = await fetch("http://localhost:8081/users/me", {
                                method: "GET",
                                credentials: "include",
                            });
                
                            if (response.ok) {
                                const userData = await response.json();
                                setUserId(userData.userID);
                                setUsername(userData.username);
                                setRole(userData.role);
                                console.log(userData.username);
                            } else {
                                console.error("Failed to fetch user ID");
                            }
                        } catch (error) {
                            console.error("Error fetching user ID:", error);
                        }
                    };
                
                    const fetchUsers = async () => {
                        try {
                            let endpoint = "http://localhost:8081/users";
                            if (role === "Trainer") {
                                endpoint = `http://localhost:8081/users/subscribers/${userId}`;
                            } else if (role === "User") {
                                endpoint = `http://localhost:8081/users/trainers/${userId}`;
                            }
                
                            const response = await fetch(endpoint);
                            if (response.ok) {
                                const data = await response.json();
                                setUsers(data.filter((user: User) => user.id !== userId)); // Exclude the current user
                                setShowUsers(true);
                            }
                        } catch (error) {
                            console.error("Error fetching users:", error);
                        }
                    };
                
                    const startChat = async (selectedUserId: string) => {
                        let chat: Chat = { id: "", user1Name: "", user2Name: "" };
                
                        try {
                            const response = await fetch("http://localhost:8081/chats/create", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    user1Id: userId,
                                    user2Id: selectedUserId,
                                }),
                            });
                            if (response.ok) {
                                console.log("Chat started successfully");
                                const chatId = await response.text(); // Read response as text
                                chat.id = chatId;
                                chat.user1Name = userId as string; // Assuming user1Name is the current user
                                chat.user2Name = selectedUserId; // Assuming user2Name is the selected user
                                console.log(chat);
                            } else {
                                console.error("Failed to start chat:", response.statusText);
                            }
                        } catch (error) {
                            console.error("Error starting chat:", error);
                        }
                        navigate(`/chat/${chat.id}`);
                    };
                
                    return (
                        <div className="max-w-2xl mx-auto p-4">
                            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                                <TiArrowBackOutline size={40} onClick={() => navigate("/home")} />
                            </div>
                            <h1 className="text-2xl font-bold mb-4">Chats</h1>
                
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
                                onClick={fetchUsers}
                            >
                                Start New Chat
                            </button>
                
                            {showUsers && (
                                <div className="p-4 border rounded-lg bg-gray-100">
                                    <h2 className="text-lg font-bold mb-2">Select a user to chat with:</h2>
                                    {users.length === 0 ? (
                                        <p className="text-red-500 font-semibold">
                                            {role === "User" ? "There's no trainers to chat with" : "There's no subscribers to chat with"}
                                        </p>
                                    ) : (
                                        <ul>
                                            {users.map((user) => (
                                                <li
                                                    key={user.id}
                                                    className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                                                    onClick={() => startChat(user.id)}
                                                >
                                                    {user.username} ({user.role})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                
                            <div className="space-y-3">
                                {chats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100"
                                        onClick={() => navigate(`/chat/${chat.id}`)}
                                    >
                                        <p className="text-lg font-medium">{chat.user1Name === username ? chat.user2Name : chat.user1Name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                };
                
                export default ChatsPage;