import { IChatCompletionMessage } from '../../..';

export interface IMessageRepository {
  addMessage(params: IChatCompletionMessage): Promise<IChatCompletionMessage>;
  getMessages(
    ownerId: string,
    chatId: string,
    isCommand: boolean,
    params?: {
      skip: number;
      limit: number;
    },
  ): Promise<IChatCompletionMessage[]>;
}
