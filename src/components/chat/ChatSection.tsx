import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "../../interfaces/chat.interface";
import { API } from "../../config/api.config";
import Api from "../../api/apiClient";

interface ChatSectionProps {
  chatId: number | null;
  socket: Socket;
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatId, socket }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorOnSend, setErrorOnSend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

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
      const response = await Api.post(`${API.SEND_MESSAGE}`, {
        chatId,
        createdAt,
        message: newMessage,
      });
      if (!response.status) return setErrorOnSend("Failed to send message");
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      if (!chatId) return;
      setIsLoading(true);
      const response = await Api.get(`${API.GET_MESSAGE}`, {
        chatId,
      });
      if (!response.status) {
        setError("Failed to retrieve messages, Please try again");
        setIsLoading(false);
        return;
      }
      setMessages(response.data);
      setIsLoading(false);
    };

    getMessages();
  }, [chatId]);

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
