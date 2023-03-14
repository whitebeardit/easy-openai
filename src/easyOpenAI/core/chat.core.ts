import {
  ChatCompletionRequestMessage,
  CreateCompletionResponseUsage,
} from 'openai';

export interface IChatCompletionMessageBase
  extends ChatCompletionRequestMessage {
  ownerId: string;
}

export interface IChatCompletionMessage extends IChatCompletionMessageBase {
  chatId: string;
  ownerId: string;
  id?: string;
  usage?: CreateCompletionResponseUsage;
  finish_reason?: string;
  object?: string;
  created?: number;
}

export interface IChat {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  updatedAt: number;
}

export class Chat implements IChat {
  _id: string;

  _title: string = 'shoot the breeze';

  _description: string = 'Chat casually about unimportant matters.';

  _ownerId: string;

  _updatedAt: number;

  constructor(params: {
    _id: string;
    ownerId: string;
    title: string;
    description?: string;
    createdAt?: number;
    _updatedAt?: number;
  }) {
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

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(date: number) {
    this._updatedAt = date;
  }
}
