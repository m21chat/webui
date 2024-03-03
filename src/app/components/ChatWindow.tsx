import { ChatMessage, db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";

export const ChatWindow: React.FC<{ dialogId: number }> = ({ dialogId }) => {
  console.log("🚀 ~ dialogId:", dialogId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const dialogMsgs = useLiveQuery(async () => {
    return db.messages.where("conversationId").equals(dialogId).toArray();
  });

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

  if (!dialogMsgs) return <></>

  return (
    <div>
      {dialogMsgs.map((msg,idx)=> (
            <div key={idx}>{msg.content}</div>
        ))}
    </div>
  );
};
