import React, { useEffect, useState } from 'react'
import axios from 'axios'
const ChatPage = () => {
    const [chats,setChats]=useState([])
    const fetchChats=async()=>{
      try {
          const {data}=await axios.get('')
          // setChats(data)
      } catch (error) {
          console.log(error)
      }
    }

    useEffect(()=>{
fetchChats()
    },[])
  return (
    <div>
      chats
      {
      chats.length>0 &&  chats.map((chat,index)=>{
            return(
                <div key={index}>
                    {chat?.message}
                </div>
            )
        })
      }
    </div>
  )
}

export default ChatPage
