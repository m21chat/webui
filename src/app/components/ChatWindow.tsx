import { ChatMessage } from '@/db/db'
import React from 'react'

export const ChatWindow: React.FC<{messages:ChatMessage[]}> = ({
  messages,
}) => {
  console.log("🚀 ~ messages:", messages)
  return (
    
    <div>
        {messages.map((msg,idx)=> (
            <div key={idx}>{msg.content}</div>
        ))}
    </div>
  )
}
