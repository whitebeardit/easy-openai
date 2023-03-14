import { Logger } from 'traceability';
import { Chat, IChatRepository } from '../';

export class ChatRepository implements IChatRepository {
  //[ ]: Cache Rotation - Pegar da memória, e se não tiver na memória, carregar do repositório. Se atingiu o limite na memória, substituir a menos usada.

  _chats: Map<String, Chat> = new Map();

  _maxInMemory = 10;

  addChat({ chat }: { chat: Chat }): Promise<void> {
    if (this._chats.has(chat.id)) {
      const error = new Error('This chat has already been added!');
      Logger.error(error.message);
      throw error;
    }
    this._chats.set(chat.id, chat);
    return Promise.resolve();
  }

  getChat({ chatId }: { chatId: string }): Promise<Chat> {
    const chat = this._chats.get(chatId);
    if (!chat) {
      const error = new Error('This chat does not exist!');
      Logger.error(error.message);
      throw error;
    }

    return Promise.resolve(chat);
  }

  getChats(
    ownerId: string,
    params?: { skip: number; limit: number },
  ): Promise<Chat[]> {
    const chats = [...this._chats.values()].filter(
      (chat) => chat.ownerId === ownerId,
    );

    const chatsSorted = chats.sort((c1, c2) => {
      if (c1._updatedAt === c2._updatedAt) return 0;
      if (c1._updatedAt < c2._updatedAt) return -1;
      return 1;
    });

    let result = chatsSorted;
    if (params) {
      if (params.skip < 0) {
        throw new Error('skip should be >= 0!');
      }
      if (params.limit < 0) {
        throw new Error('limit should be >= 0!');
      }

      if (params.limit > chatsSorted.length) {
        params.limit = chatsSorted.length;
      }

      if (params.skip >= chatsSorted.length) {
        result = [];
      } else {
        result = chatsSorted.slice(params.skip, params.skip + params.limit);
      }
    }
    return Promise.resolve(result);
  }
}
