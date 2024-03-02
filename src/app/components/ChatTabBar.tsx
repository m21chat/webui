import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import { ChatConversation } from '@/db/db';
import { ChatWindow } from './ChatWindow';



interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
}

const DraggableTabNode = ({ className, ...props }: DraggableTabPaneProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-node-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
    transition,
    cursor: 'move',
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};




export const ChatTabBar: React.FC<{ conversations: ChatConversation[] }> = ({
  conversations,
}) => {
  

  if (!conversations) return <div>No chat</div>;
  console.log("🚀 ~ conversations:", conversations)
  const [items, setItems] = useState([]);

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

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
      const tablist:any = []
      
      conversations.map((convo, idx) => {
        const tab = {
          key: convo.id?.toString(),
          label: `Dialog ${convo.id}`,
          children: <ChatWindow key={convo.id} dialogId={convo.id ?? 0}/>
        }
        tablist.push(tab)
      })
      console.log("🚀 ~ buildTabs ~ tablist:", tablist)
      return tablist
    }
    setItems(buildTabs)
  

  }, [conversations])
  

  return (
    <Tabs
      items={items}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
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
