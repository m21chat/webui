"use client";
import {
  Breadcrumb,
  Button,
  Input,
  Layout,
  Menu,
  Typography,
  theme,
} from "antd";

import type { MenuProps } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";

import { parseJSON } from "@/utils/parser";
import useLocalStorage from "use-local-storage";

import { ChatConversation, db } from "@/db/db";
import { ChatTabBar } from "./components/ChatTabBar";
import Item from "antd/es/list/Item";
import { useLiveQuery } from "dexie-react-hooks";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const { Paragraph } = Typography;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("AI Chat", "1", <PieChartOutlined />),
  getItem("Settings", "2", <FileOutlined />),
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(true);
  const [currentConversation, SetCurrentConversation] = useState("1");

  const [userInput, setUserInput] = useState("");
  const [botText, setBotText] = useState("");

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
    db.addMessage(Number(currentConversation), "user", input, true);

    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) {
        throw new Error("Missing body, ARRRGGHHHH!!!");
      }

      const itr = parseJSON(response.body);
      await processMessages(itr, input);
    } catch (error) {
      console.log(error);
      // Handle network errors here
    }
  };

  /**
   * Processes the messages received from the server and updates the assistant response.
   *
   * @param itr The iterator containing the messages received from the server.
   * @param userInput The user input message.
   * @returns {Promise<void>}
   */
  async function processMessages(itr, userInput): Promise<void> {
    let assistantResponse = "";
    const msgId = await db.addMessage(
      Number(currentConversation),
      "assistant",
      "",
      false
    );
    for await (const item of itr) {
      assistantResponse = assistantResponse.concat(item.message.content);
      setBotText((prev) => prev.concat(item.message.content));
      db.addMessage(
        Number(currentConversation),
        'assistant',
        assistantResponse,
        false,
        msgId
      );

      
      if (item.done) {
        db.addMessage(
          Number(currentConversation),
          'assistant',
          assistantResponse,
          true,
          msgId
        );
      }
    }
  }

  //TODO: #7 Make waiting for messages load less boring
  if (!conversationList) {
    return <div>No dialog</div>;
  }

  const onTabUpdate = (tabId: string) => {
    SetCurrentConversation(tabId);
  };

  const clearUserInputField = () => {
    setUserInput("");
  };

  const onInputKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Enter" && e.ctrlKey && userInput !== "") {
      sendChat(userInput);
      clearUserInputField();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Item>Home</Item>
            <Item>AI Chat</Item>
          </Breadcrumb>
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
        <Footer
          style={{
            textAlign: "center",
            position: "sticky",
            zIndex: 1,
            bottom: 0,
          }}
        >
          <Input
            placeholder="Talk to JMAC here"
            onKeyDown={onInputKeyDown}
            autoSize
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button //TODO: #9 Make send button bit more interesting
            onClick={async () => {
              sendChat(userInput);
              clearUserInputField();
            }}
          >
            Send
          </Button>
        </Footer>
      </Layout>
    </Layout>
  );
}
