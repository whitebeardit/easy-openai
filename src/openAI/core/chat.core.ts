import {
  ChatCompletionRequestMessage,
  CreateCompletionResponseUsage,
} from 'openai';
import { IMessageRepository } from './repository/interfaces/message.repository.interface';

export interface IChatCompletionMessageBase
  extends ChatCompletionRequestMessage {
  ownerId: string;
}

export interface IChatCompletionMessage extends IChatCompletionMessageBase {
  id?: string;
  usage?: CreateCompletionResponseUsage;
  finish_reason?: string;
  object?: string;
  created?: number;
}

export class Chat {
  _messageRepository: IMessageRepository;

  _id: string;

  _title: string = 'shoot the breeze';

  _description: string = 'Chat casually about unimportant matters.';

  _ownerId: string;

  _updatedAt: number;

  constructor(
    params: {
      _id: string;
      ownerId: string;
      title: string;
      description?: string;
      createdAt?: number;
    },
    repository: IMessageRepository,
  ) {
    this._messageRepository = repository;
    this._ownerId = params.ownerId;
    this._title = params.title;
    this._id = params._id;
    if (params.description) {
      this._description = params.description;
    }
    this._updatedAt = new Date().getTime();
  }

  get id() {
    return this._id;
  }

  addMessage(params: IChatCompletionMessage) {
    if (params.role === 'user') {
      params.name = this.ownerId;
    }
    params.ownerId = this.ownerId;
    this._messageRepository.addMessage(params);
    this._updatedAt = new Date().getTime();
  }

  async getMessages(params?: { skip: number; limit: number }) {
    let result = await this._messageRepository.getMessages(this.ownerId);
    if (params) {
      const { skip, limit } = params;
      result = await this._messageRepository.getMessages(this.ownerId, {
        skip,
        limit,
      });
    }
    return result;
  }

  get ownerId() {
    return this._ownerId;
  }

  get description() {
    return this._description;
  }

  get title() {
    return this._title;
  }

  set ownerId(ownerId: string) {
    this._ownerId = ownerId;
  }

  set description(description: string) {
    this._description = description;
  }

  set title(title: string) {
    this._title = title;
  }
}
