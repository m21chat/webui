import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import "../globals.css";
import { chatProgressAtom } from "../store/chatState";
import { useAtom } from "jotai";
import hljs from "highlight.js";
import { List, ListItem } from "@chakra-ui/react";
import {
  Avatar,
  Card,
  CardHeader,
  CardBody,
  Text,
  Stack,
} from "@chakra-ui/react";

export const ChatWindow: React.FC<{ dialogId: number }> = ({ dialogId }) => {
  const listRef = useRef(null);
  const [chatProgress] = useAtom(chatProgressAtom);

  const dialogMsgs = useLiveQuery(async () => {
    return db.messages.where("conversationId").equals(dialogId).toArray();
  });
  useLayoutEffect(() => {
    if (dialogMsgs && dialogMsgs.length > 0) {
      listRef.current;
      const lastMessageID = dialogMsgs[dialogMsgs.length - 1];
      const element = document.getElementById(
        `dialogcard-${String(lastMessageID.id)}`,
      );
      if (element) {
        element.scrollIntoView();
      } else {
        console.error("Element with id", lastMessageID, "not found!");
      }
    }
  }, [dialogMsgs]);

  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre code");

    codeBlocks.forEach((block) => {
      if (block instanceof HTMLElement) {
        hljs.highlightElement(block);
      }
    });
  }, [dialogMsgs]);

  if (!dialogMsgs) return <></>;

  const splittext = (content: string) => {
    const parts = content.split(/```/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const [language, ...codeLines] = part.split("\n");
        const code = codeLines.join("\n").trim();
        console.log(`Detect lang: ${language}, code: ${code}`);
        if (code) {
          return (
            <pre key={index}>
              <code className={`language-${language.trim()}`}>
                {code.trim()}
              </code>
            </pre>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <List spacing={4}>
      {dialogMsgs.map((msg) => (
        <ListItem id={"dialogcard-" + String(msg.id)} key={msg.id}>
          <Card direction="row" variant="elevated">
            <Avatar
              m={2}
              name="Human"
              src={
                msg.role === "user"
                  ? `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${dialogId}`
                  : `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${dialogId}`
              }
            ></Avatar>
            <Stack>
              <CardHeader>
                {msg.role === "user" ? <Text>Human</Text> : <Text>JMac</Text>}
              </CardHeader>
              <CardBody>
                <Text whiteSpace="pre-line">{splittext(msg.content)}</Text>
              </CardBody>
            </Stack>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};
