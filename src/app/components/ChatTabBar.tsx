//TODOLIST:
// - ADD Chat badge to count how many convo there is in each tab.


import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState } from "react";
import { Tabs, TabsProps } from "antd";
import { ChatConversation } from "@/db/db";
import { ChatWindow } from "./ChatWindow";

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-node-key": string;
}

const DraggableTabNode = ({ className, ...props }: DraggableTabPaneProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props["data-node-key"],
    });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
    transition,
    cursor: "move",
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

interface ChatTabBarprops {
  conversations: ChatConversation[],
  onTabChange: (activeKey:string) => void
}

export const ChatTabBar: React.FC<{ props:ChatTabBarprops }> = ({
  props,
}) => {
  if (!props || !props.conversations) return <div>No chat</div>;
  // console.log("🚀 ~ conversations:", props.conversations);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("1")

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setItems((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  useEffect(() => {
    const buildTabs = () => {
      const tablist: any = [];

      props.conversations.map((convo, idx) => {
        const tab = {
          key: convo.id?.toString(),
          label: `Dialog ${convo.id}`,
          children: <ChatWindow key={convo.id} dialogId={convo.id ?? 0} />,
        };
        tablist.push(tab);
      });
      return tablist;
    };
    setItems(buildTabs);
  }, [props.conversations]);

  return (
    <Tabs
      items={items}
      // activeKey={activeTab}
      onChange={props.onTabChange}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext
            items={items.map((i) => i.key)}
            strategy={horizontalListSortingStrategy}
          >
            <DefaultTabBar {...tabBarProps}>
              {(node) => (
                <DraggableTabNode {...node.props} key={node.key}>
                  {node}
                </DraggableTabNode>
              )}
            </DefaultTabBar>
          </SortableContext>
        </DndContext>
      )}
    />
  );
};
// console.log("🚀 ~ conversations:", conversations)
