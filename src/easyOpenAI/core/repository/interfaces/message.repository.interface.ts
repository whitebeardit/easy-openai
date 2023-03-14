import { IChatCompletionMessage } from '../..';

export interface IMessageRepository {
  addMessage(params: IChatCompletionMessage): Promise<void>;
  getMessages(
    ownerId: string,
    params?: {
      skip: number;
      limit: number;
    },
  ): Promise<IChatCompletionMessage[]>;
}
