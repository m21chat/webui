import Dexie, { Table } from "dexie";

export interface ChatMessage {
  id?: number;
  conversationId: number;
  role: string;
  content: string;
  images?: string;
}

export interface ChatConversation {
  id?: number;
  model: string;
}
//TODO: Need encryption
export class ClientDatabase extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  messages!: Table<ChatMessage>;
  conversations!: Table<ChatConversation>;

  constructor() {
    super("jmac");
    this.version(2).stores({
      conversations: "++id, model",
      messages: "++id, conversationId, role, content",
    });
  }

  public async startNewConversation(input: string, assistantResponse: string) {
    const dialogId = await this.conversations.add({
      model: "solar",
    });

    this.messages.add({
      conversationId: dialogId as number, //Hehe, secret hack that no one will know about.
      role: "user",
      content: input,
    });

    this.messages.add({
      conversationId: dialogId as number,
      role: "assistant",
      content: assistantResponse,
    });
  }

  public deleteDatabase(dbname:string) {
    db.delete()
  }
}

export const db = new ClientDatabase();
