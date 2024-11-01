import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Message {
  id?: number;
  createdAt: string;
  isSeen?: boolean;
  message: string;
  type: 'sent' | 'received';
}

interface ChatSectionProps {
  chatId: number | null;
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage !== '') {

      const newMessageObject: Message = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isSeen: false,
        message: newMessage,
        type: 'sent',
      };

      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage('');

      try {
        await axios.post(`http://localhost:3000/chat/send-message`, {
          chatId,
          message: newMessage,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      if (!chatId) return;

      try {
        const response = await axios.get(`http://localhost:3000/chat/get-message?chatId=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to retrieve messages", error);
      }
    };

    getMessages();
  }, [chatId]);

  if (!chatId) {
    return (
      <div>
        <p>Select a chat to start a conversation</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-2 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-2 rounded-lg max-w-xs ${msg.type === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              <p className="text-sm">{msg.message}</p>
              <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
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
        <button onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
