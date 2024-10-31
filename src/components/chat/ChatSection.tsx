import React, {useState } from 'react';

interface ChatSectionProps{
  chatId: number | null
}

const ChatSection: React.FC<ChatSectionProps> = ({chatId}) => {
 //fetch chat of that chat Id and assign using setMessages
  const [messages, setMessages] = useState<string[] | null>([]);
  const [newMessage, setNewMessage] = useState('');
  console.log(chatId)
  const handleSendMessage = () => {
    if (newMessage !== '') {
      setMessages((prevMessage)=>(prevMessage ? [...prevMessage, newMessage] : [newMessage]));
      setNewMessage('');
    }
  };


  return (
    <div className="w-2/3 p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages}
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
