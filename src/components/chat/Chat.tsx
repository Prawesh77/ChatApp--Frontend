import React, { useEffect, useState } from 'react'
import ChatList from './ChatList'
import ChatSection from './ChatSection'
import axios from 'axios'
// import { io, Socket } from 'socket.io-client';
// const token = localStorage.getItem('accessToken');


// const socket: Socket = io(`http://localhost:3000?token=${token}`);

const Chat:React.FC = () => {
  const [messageList,setMessageList]=useState([])
  const [chatId, setChatId] = useState<number | null>(null)
  useEffect(()=>{
    const getChatList = async()=>{
      const response = await axios.get('http://localhost:3000/chat/get-chat-list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      console.log(response);
      setMessageList(response.data)
    }
    getChatList();
  },[])

  return (
    <div className='flex flex-row h-100vh'>
        <ChatList chatList={messageList} setChatId={setChatId}/>
        <ChatSection chatId={chatId}/>
    </div>
  )
}

export default Chat