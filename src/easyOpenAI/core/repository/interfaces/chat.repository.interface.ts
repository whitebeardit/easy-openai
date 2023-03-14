import { Chat } from '../..';

export interface IChatRepository {
  addChat({ chat }: { chat: Chat }): Promise<void>;
  getChat({ chatId }: { chatId: string }): Promise<Chat>;
  getChats(
    ownerId: string,
    params?: { skip: number; limit: number },
  ): Promise<Chat[]>;
}