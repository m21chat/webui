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
  const [chattext, setChattext] = useState("I'm robot");
  const nameInput = useRef<HTMLInputElement>(null);
  const chatwindow = useRef(null)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if(!chatwindow || !chatwindow.current) return
    chatwindow.current.scrollIntoView({  });
  },[chattext])

  const sendChat = async (input) => {
    console.log(input)
    if(!input) {
      console.log('No input text')
      return
    }
    const res = await fetch("http://192.168.0.37:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        model: "solar",
        prompt: input,
      }),
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get reader");
    }
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log(`I am done: ${value}`)
        break;
      }
      const textDecoder = new TextDecoder("utf-8");
      const chunk = textDecoder.decode(value);
      console.log(`Chunk:${chunk}`)
      try {
        const ollamaObject = JSON.parse(chunk)
        console.log(ollamaObject);
        setChattext((prev) => prev.concat(ollamaObject.response))
      } catch (error) {
        console.log(error)
      }
      
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
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>AI Chat</Breadcrumb.Item>
          </Breadcrumb>
          <Paragraph ref={chatwindow} style={{  marginTop: 24 }}>
            <pre style={{ border: "none" }}>{chattext}</pre>
          </Paragraph>
        </Content>
        <Footer style={{ textAlign: "center", position:'sticky', zIndex:1, bottom:0  }}>
          <TextArea
            placeholder="Autosize height based on content lines"
            autoSize
            ref={nameInput}
          />
          <Button
            onClick={async () => {sendChat(nameInput.current.resizableTextArea.textArea.value)}}
          >
            Send
          </Button>
        </Footer>
      </Layout>
    </Layout>
  );
}