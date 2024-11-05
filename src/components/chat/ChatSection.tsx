import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "../../interfaces/chat.interface";
import { API } from "../../config/api.config";
import Api from "../../api/apiClient";
import { useMutation } from "@tanstack/react-query";

interface ChatSectionProps {
  chatId: number | null;
  socket: Socket;
}

interface sendMessage {
  chatId: number | null;
  createdAt: string;
  newMessage: string;
}
const ChatSection: React.FC<ChatSectionProps> = ({ chatId, socket }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorOnSend, setErrorOnSend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const sendMutation = useMutation({
    mutationFn: ({ chatId, createdAt, newMessage }: sendMessage) =>
      Api.post(`${API.SEND_MESSAGE}`, {
        chatId,
        createdAt,
        message: newMessage,
      }),
    onError: () => {
      console.log("Error Caught");
      setErrorOnSend("Failed to send message");
    },
  });

  const getMessageMutation = useMutation({
    mutationFn: (chatId: number) =>Api.get(`${API.GET_MESSAGE}`, {chatId}),
    onSuccess: (data) => {
      console.log(data);
      if(!data.status){
        setError("Failed to retrieve messages, Please try again");
        setIsLoading(false);
        return;
      }
      setMessages(data.data);
      setIsLoading(false);
    },
    onError: () => {
      setError("Failed to retrieve messages, Please try again");
      setIsLoading(false);
    },
  });

  const handleSendMessage = async () => {
    if (newMessage !== "") {
      const createdAt = new Date().toISOString();
      const newMessageObject: IMessage = {
        id: Date.now(),
        createdAt,
        isSeen: false,
        message: newMessage,
        type: "sent",
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage("");
      sendMutation.mutateAsync({ chatId, createdAt, newMessage });
    }
  };
  const getMessages = async () => {
    console.log("Get Message Called")
    if (!chatId) return;
    setIsLoading(true);
    getMessageMutation.mutateAsync(chatId);
  };

  getMessages();
  // useEffect(() => {
    
  // }, [chatId,getMessageMutation]);

  useEffect(() => {
    const handleReceiveMessage = (data: IMessage) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chatId) {
    return (
      <div>
        <p>Select a chat to start a conversation</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading chats...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-2/3 p-4 flex flex-col h-[100vh]">
      <div ref={chatContainerRef} className="flex-1 overflow-y-scroll mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${
              msg.type === "sent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-[20rem] ${
                msg.type === "sent"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
            {errorOnSend && (
              <p className="text-sm text-red-500">{errorOnSend}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex mb-4 w-full">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
