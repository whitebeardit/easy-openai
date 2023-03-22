import { IChat } from '../../..';

export interface IChatRepository {
  addChat({ chat }: { chat: IChat }): Promise<IChat>;
  getChat({ chatId }: { chatId: string }): Promise<IChat>;
  getChats(
    ownerId: string,
    params?: { skip: number; limit: number },
  ): Promise<IChat[]>;
}
