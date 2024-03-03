import { ChatMessage, db } from "@/db/db";
import { Tag } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";

import {
  RobotOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";

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
    <div >
      {dialogMsgs.map((msg, idx) => (
        <div style={{marginBottom:'1em'}}key={idx}>
          {msg.role === "user" ? (
            <Tag icon={<UserOutlined />} color="#4f772d">
              Humanoid
            </Tag>
          ) : (
            <Tag icon={<RobotOutlined />} color="#2b2d42">
              Overlord
            </Tag>
          )}
          {msg.content}
        </div>
      ))}
    </div>
  );
};
