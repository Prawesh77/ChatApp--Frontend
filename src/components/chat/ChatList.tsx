// ChatList.tsx
import React from 'react';

const ChatList: React.FC = () => {
  const users = [
    { id: 1, name: 'Ram', lastMessage: 'k hudai xa', profileImg: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' },
    { id: 2, name: 'Shyam', lastMessage: 'hora??', profileImg: 'https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg' },
  ];

  return (
    <div className="w-1/3 p-4 border-r border-gray-300 h-[100vh]">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-4 border rounded focus:outline-none"
      />
      <ul>
        {users.map(user => (
          <li key={user.id} className="flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-100">
            <img src={user.profileImg} alt={`${user.name} profile`} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
