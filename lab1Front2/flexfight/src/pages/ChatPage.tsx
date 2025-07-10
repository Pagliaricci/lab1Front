import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";

interface Message {
    id: string;
    chatId: string;
    message: string;
    senderId: string;
    recipientId: string;
    timestamp: Date;
}

interface Chat {
    id: string;
    user1Id: string;
    user2Id: string;
}

const ChatPage = () => {
    const { chatId } = useParams<{ chatId: string }>(); // ID del chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<Chat | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [reload, setReload] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchUserId();
        getChatRoom();
    }, [reload]);

    const getChatRoom = async () => {
        try {
            const response = await fetch(`http://localhost:8081/chats/getChatRoom/${chatId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                console.log(data.id)
                console.log(data.user1Id)
                console.log(data.user2Id)
                setChat(data);

            }
        } catch (error) {
            console.error("Error fetching chat room:", error);
        }
    };
    useEffect(() => {
        if (!userId || !chatId) return;
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8081/chats/getMessages/${chatId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();

        const ws = new WebSocket(`ws://localhost:8081/ws?${userId}`);

        ws.onopen = () => {
            console.log("WebSocket connected");
            setSocket(ws);
        };
        
        const getRecipientId = async (userId: string, chatId: string): Promise<string> => {
            try {
                const response = await fetch(`http://localhost:8081/chats/getRecipientId/${userId}/${chatId}`);
                if (response.ok) {
                    const data = await response.json();
                    return data;
                }
            } catch (error) {
                console.error("Error fetching recipientId:", error);
            }
            return '';
        };
        ws.onmessage = async (event) => {
            try {
                if (!chat){
                    setReload(!reload)
                }
                // 🔥 Ajustar lógica para leer el mensaje en el formato "senderId:contenido"
                const [senderId, messageContent] = event.data.split(":");
                const newMessage: Message = {
                    id: Math.random().toString(), // Generar un ID temporal
                    chatId, // Usar el chatId actual
                    message: messageContent,
                    senderId: senderId,
                    recipientId: userId !== senderId ? userId! : await getRecipientId(userId, chatId),
                    timestamp: new Date(), // Se puede cambiar si el backend envía un timestamp
                };

                console.log("Received message:", newMessage);

                // 🔥 Agregar mensaje al historial en tiempo real
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };


        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, [userId, chatId]);

    const handleSendMessage = async () => {
        setReload(!reload)
        if (!message.trim() || !userId || !chatId || !socket || !chat) return;

        const formattedMessage = `${chatId}:${message}`;  // 🔥 Se ajusta al formato esperado

        console.log("Sending message:", formattedMessage);
        socket.send(formattedMessage);  // 🔥 Enviar en el formato correcto


        setMessage(""); // Limpiar input
    };


    const fetchUserId = async () => {
        try {
            const response = await fetch("http://localhost:8081/users/me", { credentials: "include" });
            if (response.ok) {
                const userData = await response.json();
                setUserId(userData.userID);
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
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
                    onClick={() => navigate("/chats")}
                    className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-orange-200/30"
                >
                    <TiArrowBackOutline className="text-xl text-orange-600" />
                </button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">Chat</h1>
                    <p className="text-gray-600">Stay connected with your fitness community</p>
                </div>

                {/* Chat Container */}
                <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-orange-100/50 overflow-hidden">
                    {/* Messages Area */}
                    <div className="h-96 overflow-y-auto p-6 bg-gray-50/50">
                        {messages.length > 0 ? (
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                            msg.senderId === userId 
                                                ? "bg-orange-500 text-white rounded-br-sm" 
                                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                                        }`}>
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">No messages yet</p>
                                    <p className="text-gray-400 text-sm">Start the conversation!</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} /> {/* Ref para el final de los mensajes */}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-lg p-6">
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    type="text"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                            </div>
                            <button
                                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;