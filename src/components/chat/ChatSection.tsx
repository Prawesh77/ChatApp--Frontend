import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { IMessage } from '../../interfaces/chat.interface';

interface ChatSectionProps {
  chatId: number | null;
  socket: Socket;
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatId, socket}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorOnSend, setErrorOnSend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSendMessage = async () => {
    if (newMessage !== '') {
      const createdAt = new Date().toISOString()
      const newMessageObject: IMessage = {
        id: Date.now(),
        createdAt,
        isSeen: false,
        message: newMessage,
        type: 'sent',
      };

      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage('');
      try {
        await axios.post(`http://localhost:3000/chat/send-message`, {
          chatId,
          createdAt,
          message: newMessage,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      } catch (error) {
        setErrorOnSend("Failed to send message");
        console.error("Failed to send message", error);
      }
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      if (!chatId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/chat/get-message?chatId=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        setError("Failed to retrieve messages, Please try again")
        console.error("Failed to retrieve messages", error);
      }finally{
        setIsLoading(false);
      }
    };

    getMessages();
  }, [chatId]);

  useEffect(() => {
    const handleReceiveMessage = (data: IMessage) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);

    };
  
    socket.on('receive-message', handleReceiveMessage);
  
    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, []);


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
            {errorOnSend && <p className="text-sm text-red-500">{errorOnSend}</p>}
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
