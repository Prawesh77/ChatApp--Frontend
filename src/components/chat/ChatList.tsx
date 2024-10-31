import React from 'react';
import { IChatList } from '../../interfaces/chat.interface';


interface ChatListProps{
  chatList: IChatList[],
  setChatId: React.Dispatch<React.SetStateAction<number | null>>
}

const ChatList: React.FC<ChatListProps> = ({chatList, setChatId}) => {

  const handleChatListClick = (chat: IChatList) => {
  setChatId(chat.chat.id);
}
  return (
    <div className="w-1/3 p-4 border-r border-gray-300 h-[100vh]">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-4 border rounded focus:outline-none"
      />
      <ul>
        {
          chatList.map((chat)=>(<li onClick={()=>handleChatListClick(chat)}>
            <div className='flex flex-row items-center mb-3'>
              <img src='https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg' className='w-8 h-8 rounded-full mr-2' alt='ProfilePicture'/>
              <div className='flex flex-col justify-center'>
                <p>{chat.type === 'received' ? `${chat.sender.email}`: `${chat.receiver.email}`}</p>
                <p>{chat.type === 'received' ? `${chat.message}`: `You: ${chat.message}`}</p>
              </div>
            </div>
          </li>))
        }
      </ul>
    </div>
  );
};

export default ChatList;
