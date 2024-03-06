import { ChatMessage, db } from "@/db/db";
import { Avatar, Card, Tag } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "../globals.css";

import {
  RobotOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

export const ChatWindow: React.FC<{ dialogId: number }> = ({ dialogId }) => {
  const dialogMsgs = useLiveQuery(async () => {
    return db.messages.where("conversationId").equals(dialogId).toArray();
  });

  useLayoutEffect(() => {
    
    if (dialogMsgs && dialogMsgs.length > 0) {
      const lastMessageID = dialogMsgs[dialogMsgs.length - 1];
      const element = document.getElementById(`dialogcard-${String(lastMessageID.id)}`);
      if (element) { 
        element.scrollIntoView();
      } else {
        console.error('Element with id', lastMessageID, 'not found!');
      }
    }
  }, [dialogMsgs]);

  if (!dialogMsgs) return <></>;

  return (
    <div>
      {dialogMsgs.map((msg, idx) => (
        <Card
          key={idx}
          id={msg.role === 'assistant' ? `dialogcard-${String(msg.id)}` : undefined} // Or null
          style={{ width: 700, marginTop: 16 }}
        >
          <Meta
            avatar={
              msg.role === "user" ? (
                <Avatar
                  src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${dialogId}`}
                />
              ) : (
                <Avatar
                  src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${dialogId}`}
                />
              )
            }
            title={
              msg.role === "user"
                ? "Haplorhini"
                : `JMAC v${process.env.NEXT_PUBLIC_APP_VERSION}`
            }
            description={msg.content}
          />
        </Card>
      ))}
    </div>
  );
};
