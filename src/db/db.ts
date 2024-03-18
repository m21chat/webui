import Dexie, { Table, Transaction } from "dexie";

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
    this.on("populate", (trans: any) => {
      trans.conversations.add({
        model: "solar",
      });
    });
  }

  public async startNewConversation() {
    const dialogId = await this.conversations.add({
      model: "solar",
    });
    return dialogId as number;
  }

  /**
   * Asynchronously adds a new message to a specified conversation.
   *
   * @param conversationId - The unique identifier of the conversation to add the message to.
   * @param role - The role of the message sender (e.g., "user", "system", "assistant", etc.)
   * @param message - The textual content of the message.
   * @param complete - Whether the task the message might describe is completed.
   * @param messageId - (Optional) An existing ID for the message. Typically used for updating messages.
   * @returns Promise<number> - A promise resolving to the newly generated message ID.
   */
  public async addMessage(
    conversationId: number,
    role: string,
    message: string,
    complete: boolean,
    messageId?: number,
  ): Promise<number> {
    const msgId = await this.messages.put({
      id: messageId,
      role: role,
      conversationId: conversationId,
      complete: complete,
      content: message,
    });
    return msgId as number;
  }

  /**
   * Asynchronously retrieves the most recent messages from a specified conversation.
   *
   * @param conversationId - The unique identifier of the conversation to fetch messages from.
   * @param limit - (Optional) The maximum number of messages to return. Defaults to 5.
   * @returns Promise<ChatMessage[]> - A promise resolving to an array of ChatMessage objects representing the latest messages.
   */
  public async getLatestMessages(
    converstationId: number,
    limit: number = 5,
  ): Promise<ChatMessage[]> {
    return await this.messages
      .where("conversationId")
      .equals(converstationId)
      .reverse()
      .limit(limit)
      .toArray();
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
