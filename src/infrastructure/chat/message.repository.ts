import { IChatCompletionMessage, IMessageRepository } from '../../';

export class MessageRepository implements IMessageRepository {
  // getMessages(ownerId: string, chatId: string, isCommand: boolean, params?: { skip: number; limit: number; } | undefined): Promise<IChatCompletionMessage[]> {
  //   throw new Error('Method not implemented.');
  // }
  //[ ]: Cache Rotation - Pegar da memória, e se não tiver na memória, carregar do repositório. Se atingiu o limite na memória, substituir a menos usada.

  _messages: IChatCompletionMessage[] = [];

  // eslint-disable-next-line max-params
  getMessages(
    ownerId: string,
    chatId: string,
    isCommand: boolean,
    params?: {
      skip: number;
      limit: number;
    },
  ): Promise<IChatCompletionMessage[]> {
    console.info({ MYMSG: this._messages, ownerId, chatId, isCommand });
    let result = this._messages.filter(
      (message) =>
        message.ownerId === ownerId &&
        message.chatId === chatId &&
        message.isCommand === isCommand,
    );
    console.info({ result });

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
