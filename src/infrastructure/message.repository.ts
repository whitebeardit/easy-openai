import { IChatCompletionMessage, IMessageRepository } from '..';

export class MessageRepository implements IMessageRepository {
  //[ ]: Cache Rotation - Pegar da memória, e se não tiver na memória, carregar do repositório. Se atingiu o limite na memória, substituir a menos usada.

  _messages: IChatCompletionMessage[] = [];

  getMessages(
    ownerId: string,
    chatId: string,
    params?: {
      skip: number;
      limit: number;
    },
  ): Promise<IChatCompletionMessage[]> {
    let result = this._messages.filter(
      (message) => message.ownerId === ownerId && message.chatId === chatId,
    );

    if (params) {
      if (params.skip < 0) {
        throw new Error('skip should be >= 0!');
      }
      if (params.limit < 0) {
        throw new Error('limit should be >= 0!');
      }

      if (params.limit > result.length) {
        params.limit = result.length;
      }

      if (params.skip >= result.length) {
        result = [];
      } else {
        result = result.slice(params.skip, params.skip + params.limit);
      }
    }
    return Promise.resolve(result);
  }

  addMessage(params: IChatCompletionMessage): Promise<IChatCompletionMessage> {
    this._messages.push(params);
    return Promise.resolve(params);
  }
}
