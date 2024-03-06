import { ChatMessage, db } from "@/db/db";
import { Avatar, Card, List, Skeleton, Tag } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Space } from "antd";
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
      const element = document.getElementById(
        `dialogcard-${String(lastMessageID.id)}`
      );
      if (element) {
        element.scrollIntoView();
      } else {
        console.error("Element with id", lastMessageID, "not found!");
      }
    }
  }, [dialogMsgs]);

  if (!dialogMsgs) return <></>;

  // <Skeleton loading={loading} active avatar>
  //             <List.Item.Meta
  //               avatar={<Avatar src={item.avatar} />}
  //               title={<a href={item.href}>{item.title}</a>}
  //               description={item.description}
  //             />
  //             {item.content}
  //           </Skeleton>

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={dialogMsgs}
      renderItem={(item) => (
        <List.Item
          key={item.role}
          // actions={[  //FOR LATER
          //   <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
          //   <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
          //   <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          // ]}
        >
          <List.Item.Meta
            avatar={
              item.role === "user" ? (
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
              item.role === "user"
                ? "Haplorhini"
                : `JMAC v${process.env.NEXT_PUBLIC_APP_VERSION}`
            }
            description="Placeholder for date and other things"
          />
          {item.content}
        </List.Item>
      )}
    />
  );
};
