import { ChatMessage, db } from "@/db/db";
import { Avatar, Card, Tag } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";
import '../globals.css'


import {
  RobotOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

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
        setMessages([...messages, chat]);
      });
    }
  }, []);

  

  if (!dialogMsgs) return <></>;

  return (
    <div>
      {dialogMsgs.map((msg, idx) => (
        <Card style={{ width: 700, marginTop: 16 }} >
        <Meta
            avatar={msg.role === "user" ? ( 
                    <Avatar src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${dialogId}`} /> 
                  ) : (
                     <Avatar src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${dialogId}`} />
                  )}
            title={msg.role === "user" ? (
              "Haplorhini"
            ) : ( 
              `JMAC v${process.env.NEXT_PUBLIC_APP_VERSION}`
            )}
            description={msg.content}
        />
      </Card>

        
      ))}
    </div>
  );
};
