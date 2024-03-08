import { atom } from "jotai";

export interface ChatProgress {
  chatId: string; // Unique identifier for the chat
  isInProgress: boolean;
}

export const chatProgressAtom = atom<ChatProgress | null>(null);
// Initially, no chat is in progress
