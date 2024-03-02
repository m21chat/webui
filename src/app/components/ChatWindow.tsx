import { ChatMessage, db } from "@/db/db";
import React, { useEffect, useState } from "react";

export const ChatWindow: React.FC<{ dialogId: number }> = ({ dialogId }) => {
  console.log("🚀 ~ dialogId:", dialogId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // db.delete()
    if (dialogId) {
      const msglist = db.messages.where("conversationId").equals(dialogId);
      msglist.each((chat) => {
        console.log("🚀 ~ msglist.each ~ chat:", chat);
        setMessages([...messages, chat])
      });
    }
  }, []);

  return (
    <div>
      {messages.map((msg,idx)=> (
            <div key={idx}>{msg.content}</div>
        ))}
    </div>
  );
};
