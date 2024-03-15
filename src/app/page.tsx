"use client";
import {
  Alert,
  Breadcrumb,
  Button,
  ConfigProvider,
  Flex,
  Input,
  Layout,
  Menu,
  Skeleton,
  theme,
} from "antd";

import { parseJSON } from "@/utils/parser";
import { FileOutlined, CommentOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import React, { KeyboardEvent, useState } from "react";
import IconAI from "./icons/ai.svg";
import { db } from "@/db/db";
import Item from "antd/es/list/Item";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { ChatTabBar } from "./components/ChatTabBar";
import { chatProgressAtom } from "./store/chatState";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("AI Chat", "1", <CommentOutlined />),
  getItem("Settings", "2", <FileOutlined />),
];
console.log(<IconAI />);

export default function Home() {
  const [collapsed, setCollapsed] = useState(true);
  const [currentConversation, SetCurrentConversation] = useState("1");
  const [chatProgress, setChatProgress] = useAtom(chatProgressAtom);
  const [userInput, setUserInput] = useState("");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const conversationList = useLiveQuery(async () => {
    return db.conversations.toArray();
  });

  /**
   * Sends a chat message to a server and receives a response.
   * @param input The chat message to send to the server.
   */
  const sendChat = async (input: string): Promise<void> => {
    if (!input) {
      return;
    }

    setUserInput(input);
    setChatProgress({ chatId: uuidv4(), isInProgress: true });
    ``;
    db.addMessage(Number(currentConversation), "user", input, true);

    try {
      const response = await fetch("https://api.m21.chat/chat", {
        method: "POST",
        body: JSON.stringify({
          model: "solar",
          messages: [
            {
              role: "user",
              content: input,
            },
          ],
        }),
      });

      if (!response.body) {
        throw new Error("Missing body, ARRRGGHHHH!!!");
      }

      const itr = parseJSON(response.body);
      await processMessages(itr);
      setChatProgress({ chatId: uuidv4(), isInProgress: false });
    } catch (error) {
      console.log(error);
      // Handle network errors here
    }
  };

  /**
   * Processes the messages received from the server and updates the assistant response..
   *
   * @param itr The iterator containing the messages received from the server.
   * @param userInput The user input message.
   * @returns {Promise<void>}
   */
  async function processMessages(itr: any): Promise<void> {
    let assistantResponse = "";
    const msgId = await db.addMessage(
      Number(currentConversation),
      "assistant",
      "",
      false,
    );
    for await (const item of itr) {
      assistantResponse = assistantResponse.concat(item.message.content);
      db.addMessage(
        Number(currentConversation),
        "assistant",
        assistantResponse,
        false,
        msgId,
      );

      if (item.done) {
        db.addMessage(
          Number(currentConversation),
          "assistant",
          assistantResponse,
          true,
          msgId,
        );
      }
    }
  }

  //TODO: #7 Make waiting for messages load less boring

  const onTabUpdate = (tabId: string) => {
    SetCurrentConversation(tabId);
  };

  const clearUserInputField = () => {
    setUserInput("");
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && event.ctrlKey && userInput !== "") {
      sendChat(userInput);
      clearUserInputField();
    }
  };

  return (
    <ConfigProvider theme={{ cssVar: true, algorithm: theme.darkAlgorithm }}>
      <Layout>
        <Skeleton
          active
          loading={!conversationList}
          avatar
          paragraph={{ rows: 4 }}
        >
          <div className="sticky top-0 z-10 w-full h-24">
            <Alert
              className="flex justify-center items-center"
              message="This is a alpha version. Report any bugs at github.com/m21chat"
              banner
            />
          </div>
          <Content style={{ margin: "0 16px" }}>
            <Button
              onClick={() => {
                db.startNewConversation();
              }}
            >
              New
            </Button>
            <ChatTabBar
              props={{
                conversations: conversationList,
                onTabChange: onTabUpdate,
              }}
            />
          </Content>
          <Footer className="flex items-center justify-between sticky align-text-center z-1 bottom-0 space-x-2">
            <Input
              placeholder="Talk to JMAC here"
              onKeyDown={onInputKeyDown}
              disabled={chatProgress?.isInProgress}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button //TODO: #9 Make send button bit more interesting
              disabled={chatProgress?.isInProgress}
              onClick={async () => {
                sendChat(userInput);
                clearUserInputField();
              }}
            >
              Send
            </Button>
          </Footer>
        </Skeleton>
      </Layout>
    </ConfigProvider>
  );
}
