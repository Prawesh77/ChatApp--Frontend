import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";
import { io, Socket } from "socket.io-client";
import { IChatList } from "../../interfaces/chat.interface";
import { API } from "../../config/api.config";
import Api from "../../api/apiClient";

const Chat: React.FC = () => {
  const [messageList, setMessageList] = useState<IChatList[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const socketInstance: Socket = io(`http://localhost:3001?token=${token}`);

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to chat server");
    });

    socketInstance.on("chat-list", (data: IChatList) => {
      setMessageList((prevList) => {
        const messageExists = prevList.some(
          (item) => item.chat.id === data.chat.id
        );

        if (messageExists) {
          return prevList.map((item) =>
            item.chat.id === data.chat.id ? data : item
          );
        } else {
          return [...prevList, data];
        }
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const getChatList = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await Api.get(`${API.GET_CHAT_LIST}`);
        if(!response.status){ 
          setError("Failed to load chat list");
          setIsLoading(false);
          return 
        }
        setMessageList(response.data);
        setIsLoading(false);
    };

    getChatList();
  }, []);

  if (!socket) {
    return <div className="p-4">Connecting to chat server...</div>;
  }

  return (
    <div className="flex flex-row h-100vh">
      <ChatList
        chatList={messageList}
        setChatList={setMessageList}
        setChatId={setChatId}
        error={error}
        isLoading={isLoading}
      />
      <ChatSection chatId={chatId} socket={socket} />
    </div>
  );
};

export default Chat;