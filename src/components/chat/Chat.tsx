import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";
import { io, Socket } from "socket.io-client";
import { IChatList } from "../../interfaces/chat.interface";
import { API } from "../../config/api.config";
import Api from "../../api/apiClient";
import { useQuery } from "@tanstack/react-query";

const Chat: React.FC = () => {
  const [messageList, setMessageList] = useState<IChatList[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [errorSocket, setErrorSocket] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const getChatList = async () => {
    const response = await Api.get(`${API.GET_CHAT_LIST}`);
    return response.data
};
console.log('rendered')
  const { data, error, isLoading } = useQuery({
    queryKey: ['chatList'],
    queryFn: getChatList
  });

  useEffect(() => {
    if (data) {
      setMessageList(data);
    }
  }, [data]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const socketInstance: Socket = io(`http://localhost:3001?token=${token}`);

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      // setErrorSocket("Failed to connect to chat server");
      setErrorSocket(null);
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
        errorSocket={errorSocket}
        isLoading={isLoading}
      />
      <ChatSection chatId={chatId} socket={socket} />
    </div>
  );
};

export default Chat;