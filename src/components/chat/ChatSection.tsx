import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
const token = localStorage.getItem('accessToken');

const socket: Socket = io(`http://localhost:3000?token=${token}`);

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Ram', text: 'Hello K xa' },
    { id: 2, sender: 'You', text: 'Thik xa yar, 😊' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, sender: 'Ram', text: data }]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send-message', newMessage);
      console.log('sent')
      setMessages([...messages, { id: messages.length + 1, sender: 'You', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-2/3 p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map(message => (
          <div key={message.id} className={`mb-2 ${message.sender === 'You' ? 'text-right' : ''}`}>
            <p className="text-sm font-semibold">{message.sender}</p>
            <p className="p-2 rounded-lg bg-gray-200 inline-block">{message.text}</p>
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
