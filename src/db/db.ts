import Dexie, { Table } from 'dexie';



export interface ChatMessage {
  id?: number
  role: string
  content: string
  images?: string
}

export interface ChatConversation {
  id?: number;
  model: string;
  messages: ChatMessage[];
}
//TODO: Need encryption
export class ClientDatabase extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  messages!: Table<ChatMessage>
  conversations!: Table<ChatConversation>;

  constructor() {
    super('jmac');
    this.version(1).stores({
      messages: '++id, role, content, images',
      conversations: '++id, model, *messages' 
    });
  }

  public startNewConversation(input: string, assistantResponse: string) {
    this.conversations.add({
      model: 'solar',
      messages: [
        {
          role: 'user',
          content: input
        }, {
          role: 'assistant',
          content: assistantResponse
        }
      ]
    });
  }
}

export const db = new ClientDatabase();

