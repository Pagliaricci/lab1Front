import { useEffect, useState } from "react";
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
                console.log("AJFWQJHFGQJW")
                console.log(chat)
                console.log("chatId", chatId);
                console.log("senderId", senderId);
                console.log("messageContent", messageContent);
                console.log("userId", userId);
                // 🟢 Crear un objeto de mensaje con el formato correcto
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
        <div className="max-w-2xl mx-auto p-4">
            <div className="absolute top-4 left-4 transition-transform duration-300 transform hover:scale-110">
                <TiArrowBackOutline size={40} onClick={() => navigate("/chats")} />
            </div>
            <h1 className="text-xl font-bold mb-4">Chat</h1>

            <div className="space-y-3 max-h-[400px] overflow-auto p-2 border rounded-lg bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === userId ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                            {msg.message}
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