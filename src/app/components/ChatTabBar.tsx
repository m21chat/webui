//TODOLIST:
// - ADD Chat badge to count how many convo there is in each tab.

import React, { useEffect, useState } from "react";
import { ChatConversation } from "@/db/db";
import { ChatWindow } from "./ChatWindow";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

interface ChatTabBarprops {
  conversations: ChatConversation[];
  onTabChange: (activeKey: number) => void;
  onNewTab: () => void;
}

interface ChatTab {
  // Keep the interface for clarity
  key: string;
  label: string;
  content: React.ReactNode; // Updated to 'content'
}

export const ChatTabBar: React.FC<{ props: ChatTabBarprops }> = ({ props }) => {
  if (!props || !props.conversations) return <div>No chat</div>;
  const [items, setItems] = useState<ChatTab[]>([]);

  const handleAddTab = () => {
    props.onNewTab();
  };

  useEffect(() => {
    const buildTabs = () => {
      return props.conversations.map((convo) => ({
        key: convo.id?.toString(),
        label: `Dialog ${convo.id}`,
        content: <ChatWindow key={convo.id} dialogId={convo.id ?? 0} />,
      }));
    };
    setItems(buildTabs());
  }, [props.conversations]);

  return (
    <Tabs onChange={props.onTabChange} width="100%">
      <TabList>
        {items.map((tab) => (
          <Tab key={tab.key}>{tab.label}</Tab>
        ))}
        <Button as={Tab} onClick={handleAddTab}>
          <Icon as={FaPlus} />
        </Button>
      </TabList>

      <TabPanels>
        {items.map((tab) => (
          <TabPanel key={tab.key}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
