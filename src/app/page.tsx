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

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const { TextArea } = Input;
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
  const [dialogs, setDialogs] = useState<ChatConversation[]>([]);

  const [userInput, setUserInput] = useState("");
  const [botText, setBotText] = useState("");

  const nameInput = useRef<HTMLInputElement>(null);
  const chatwindow = useRef(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    db.conversations.toArray((dialog) => {
      setDialogs(dialog);
    });
  }, [db.conversations]);

  useEffect(() => {
    if (!chatwindow || !chatwindow.current) return;
    chatwindow.current.scrollIntoView({});
  }, [botText]);

  /**
   * Sends a chat message to a server and receives a response.
   * @param input The chat message to send to the server.
   */
  const sendChat = async (input: string): Promise<void> => {
    if (!input) {
      console.log("No input text");
      return;
    }

    setUserInput(input);

    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });
      if (!response.body) {
        throw new Error("Missing body");
      }

      const itr = parseJSON(response.body);
      await processMessages(itr, input); 
    } catch (error) {
      console.log(error);
    }
  };

  async function processMessages(itr, userInput) {
    let assistantResponse = '';
    for await (const item of itr) {
      setDialogs({id:-1, model:'solar', messages:[{id:-1, role:'assistant', content:botText}]})
      assistantResponse = assistantResponse.concat(item.message.content);
      setBotText((prev) => prev.concat(item.message.content));
  
      if (item.done) { 
        db.startNewConversation(userInput, assistantResponse);

      }
    }
  }

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

          <ChatTabBar conversations={dialogs} />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            position: "sticky",
            zIndex: 1,
            bottom: 0,
          }}
        >
          <TextArea
            placeholder="Autosize height based on content lines"
            autoSize
            ref={nameInput}
          />
          <Button
            onClick={async () => {
              sendChat(nameInput.current.resizableTextArea.textArea.value);
            }}
          >
            Send
          </Button>
        </Footer>
      </Layout>
    </Layout>
  );
}
