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
                        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 relative">
                            {/* Background decorative elements */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl"></div>
                                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl"></div>
                            </div>
                
                            {/* Back Button */}
                            <div className="absolute top-6 left-6 z-10">
                                <button
                                    onClick={() => navigate("/home")}
                                    className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-orange-200/30"
                                >
                                    <TiArrowBackOutline className="text-xl text-orange-600" />
                                </button>
                            </div>
                
                            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-4xl font-bold text-orange-600 mb-2">Chats</h1>
                                    <p className="text-gray-600">Connect with trainers and subscribers</p>
                                </div>
                
                                {/* Main Content */}
                                <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-orange-100/50">
                                    {/* Start New Chat Button */}
                                    <div className="text-center mb-6">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                            onClick={fetchUsers}
                                        >
                                            Start New Chat
                                        </button>
                                    </div>
                
                                    {/* Users Selection */}
                                    {showUsers && (
                                        <div className="mb-6 p-6 bg-blue-50/80 rounded-xl border border-blue-200/50">
                                            <h2 className="text-lg font-bold text-blue-800 mb-4">Select a user to chat with:</h2>
                                            {users.length === 0 ? (
                                                <div className="text-center py-4">
                                                    <p className="text-red-600 font-semibold">
                                                        {role === "User" ? "There's no trainers to chat with" : "There's no subscribers to chat with"}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {users.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            className="p-4 cursor-pointer bg-white/80 backdrop-blur-lg rounded-lg border border-blue-200/30 hover:bg-blue-100/50 transition-colors duration-200"
                                                            onClick={() => startChat(user.id)}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-semibold text-gray-800">{user.username}</span>
                                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                                                    {user.role}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                
                                    {/* Chat List */}
                                    <div className="space-y-3">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Conversations</h2>
                                        {chats.length > 0 ? (
                                            chats.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="p-4 bg-white/80 backdrop-blur-lg rounded-xl border border-orange-200/30 shadow-sm cursor-pointer hover:bg-orange-50/50 transition-all duration-200 transform hover:scale-[1.01]"
                                                    onClick={() => navigate(`/chat/${chat.id}`)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-800">
                                                                {chat.user1Name === username ? chat.user2Name : chat.user1Name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">Click to open conversation</p>
                                                        </div>
                                                        <div className="text-orange-500">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 mb-4">
                                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-lg">No conversations yet</p>
                                                <p className="text-gray-400 text-sm mt-2">Start a new chat to begin messaging</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                };
                
                export default ChatsPage;