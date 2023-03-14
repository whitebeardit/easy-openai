import { IChatCompletionMessage } from '../..';

export interface IMessageRepository {
  addMessage(params: IChatCompletionMessage): Promise<IChatCompletionMessage>;
  getMessages(
    ownerId: string,
    chatId: string,
    params?: {
      skip: number;
      limit: number;
    },
  ): Promise<IChatCompletionMessage[]>;
}
