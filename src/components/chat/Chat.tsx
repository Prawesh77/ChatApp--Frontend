import React from 'react'
import ChatList from './ChatList'
import ChatSection from './ChatSection'

const Chat:React.FC = () => {
  return (
    <div className='flex flex-row h-100vh'>
        <ChatList/>
        <ChatSection/>
    </div>
  )
}

export default Chat