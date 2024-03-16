import Dexie, { Table } from "dexie";

export interface ChatMessage {
  id?: number;
  conversationId: number;
  role: string;
  content: string;
  complete: boolean;
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
    console.log("Init DB");
    super("jmac");
    this.version(3).stores({
      conversations: "++id, model",
      messages: "++id, conversationId, role, content, complete",
    });
  }

  public async startNewConversation() {
    const dialogId = await this.conversations.add({
      model: "solar",
    });
    return dialogId as number;
  }

  public async addMessage(
    conversationId: number,
    role: string,
    message: string,
    complete: boolean,
    messageId?: number,
  ) {
    const msgId = await this.messages.put({
      id: messageId,
      role: role,
      conversationId: conversationId,
      complete: complete,
      content: message,
    });
    return msgId as number;
  }

  // public async addDialog(converstationId:number, userMsg:string, assistantMsg:string) {
  //   this.messages.add({
  //     conversationId: converstationId as number, //Hehe, secret hack that no one will know about.
  //     role: "user",
  //     content: userMsg,
  //   });

  //   const assistantResult = await this.messages.add({
  //     conversationId: converstationId as number,
  //     role: "assistant",
  //     content: assistantMsg,
  //   });
  //   console.log("🚀 ~ ClientDatabase ~ addDialog ~ assistantResult:", assistantResult)
  // }

  public deleteDatabase(dbname: string) {
    db.delete();
  }
}

export const db = new ClientDatabase();
