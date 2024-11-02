import React from "react";
import { IChatList } from "../../interfaces/chat.interface";
import axios from "axios";

interface ChatListProps {
  chatList: IChatList[];
  setChatList: React.Dispatch<React.SetStateAction<IChatList[]>>;
  setChatId: React.Dispatch<React.SetStateAction<number | null>>;
  error: string | null;
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  chatList,
  setChatId,
  error,
  isLoading,
  setChatList,
}) => {
  const handleChatListClick = (chat: IChatList) => {
    setChatId(chat.chat.id);
    if (chat.type === "received") {
      axios.patch(
        "http://localhost:3000/chat/seen-status",
        {chatId: chat.chat.id},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setChatList((prevChatList)=>{
        return prevChatList.map((chatt) =>
          chatt.chat.id === chat.chat.id
            ? { ...chatt, isSeen: true }
            : chatt
        );
      })
    }
  };
  if (isLoading) {
    return <div className="p-4">Loading chats...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  return (
    <div className="w-1/3 p-4 border-r border-gray-300 h-[100vh]">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-4 border rounded focus:outline-none"
      />
      <ul>
        {chatList.map((chat, index) => (
          <li onClick={() => handleChatListClick(chat)}>
            <div key={index} className="flex flex-row items-center mb-3">
              <img
                src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg"
                className="w-8 h-8 rounded-full mr-2"
                alt="ProfilePicture"
              />
              <div className="flex flex-col justify-center">
                <p>
                  {chat.type === "received"
                    ? `${chat.sender.email}`
                    : `${chat.receiver.email}`}
                </p>
                <p
                  className={`${
                    (chat.isSeen === false) &&
                    chat.type === "received"
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {chat.type === "received"
                    ? `${chat.message}`
                    : `You: ${chat.message}`}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
