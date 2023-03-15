import { randomUUID } from 'crypto';
import { CreateChatCompletionResponse } from 'openai';
import { Logger } from 'traceability';
import {
  IChat,
  IChatCompletionMessage,
  IChatCompletionMessageBase,
  IChatRepository,
  IMessageRepository,
  OpenAI,
} from '.';

export enum EHumor {
  'SARCASTIC' = 'sarcastic',
  'LIGHTHEARTED' = 'lighthearted',
  'BLACK' = 'black',
}

export enum EModel {
  'GPT-3.5-TURBO' = 'gpt-3.5-turbo',
  'GPT-3.5-TURBO-0301' = 'gpt-3.5-turbo-0301',
  'TEXT-DAVINCI-003' = 'text-davinci-003',
}

export class Assistant {
  private _id: string = randomUUID();

  private _name = 'Whitebeard';

  private _humor: EHumor = EHumor.SARCASTIC;

  private _model: EModel = EModel['GPT-3.5-TURBO'];

  private _openAIApi = OpenAI.getInstance().getOpenAI();

  context: IChatCompletionMessageBase[] = [];

  _chatRepository: IChatRepository;

  _messageRepository: IMessageRepository;

  constructor(
    chatRepository: IChatRepository,
    messageRepository: IMessageRepository,
    params?: {
      name?: string;
      humor?: EHumor;
      model?: EModel;
      id?: string;
    },
  ) {
    if (params) {
      this.name = params.name || this.name;
      this.humor = params.humor || this.humor;
      this.id = params.id || this.id;
      this.model = params.model || this.model;
    }
    this._chatRepository = chatRepository;
    this._messageRepository = messageRepository;
    this.setup();
  }

  private setup() {
    this.context.splice(0);
    this.context.push({
      role: 'system',
      content: `You are a ${this.humor} assistant and your name is ${this.name}.`,
      ownerId: 'Whitebeard',
    });
  }

  set humor(humor: EHumor) {
    this._humor = humor;
    this.setup();
  }

  set name(name: string) {
    this._name = name;
    this.setup();
  }

  set model(model: EModel) {
    this._model = model;
  }

  set id(id: string) {
    this._id = id;
  }

  get humor() {
    return this._humor;
  }

  get name() {
    return this._name;
  }

  get model() {
    return this._model;
  }

  get id() {
    return this._id;
  }

  async addChat({ chat }: { chat: IChat }) {
    try {
      return await this._chatRepository.addChat({ chat });
    } catch (error: any) {
      Logger.error(`${error.message}`, {
        eventName: `Assistant.addChat`,
        eventData: error,
      });
      return;
    }
  }

  async getChat({ chatId }: { chatId: string }) {
    const chat = await this._chatRepository.getChat({ chatId });
    return chat;
  }

  async getChats(ownerIdId: string, params?: { skip: number; limit: number }) {
    return this._chatRepository.getChats(ownerIdId, params);
  }

  getOpenAIApi() {
    return this._openAIApi;
  }

  private extractAnswer(chat: IChat, answer: CreateChatCompletionResponse) {
    try {
      const answerMessage: IChatCompletionMessage = {
        content: answer.choices[0].message?.content || '',
        role: answer.choices[0].message?.role || 'assistant',
        usage: answer.usage,
        finish_reason: answer.choices[0].finish_reason,
        id: answer.id,
        created: answer.created,
        object: answer.object,
        ownerId: chat.ownerId,
        chatId: chat.id,
      };
      return answerMessage;
    } catch (error: any) {
      Logger.error(error.message);
      return;
    }
  }

  private async prepareMessageToSend(chat: IChat) {
    Logger.info('Preparing messages to send ...');
    const chatMessages = await this._messageRepository.getMessages(
      chat.ownerId,
      chat.id,
    );
    const messages = [...this.context, ...chatMessages];
    const messageToSend = messages.map((m) => {
      return { role: m.role, content: m.content };
    });
    return messageToSend;
  }

  async addMessage(message: IChatCompletionMessage) {
    return this._messageRepository.addMessage(message);
  }

  async getMessages({ chatId, ownerId }: { ownerId: string; chatId: string }) {
    const messages = await this._messageRepository.getMessages(ownerId, chatId);
    return messages;
  }

  async sendChat(chatId: string): Promise<IChatCompletionMessage | undefined> {
    const chat = await this.getChat({ chatId });
    if (!chat) {
      const error = new Error('Chat was not found!');
      Logger.error(error.message);
      throw error;
    }

    Logger.debug(`Sending messages from chat ${chatId}`);
    const messageToSend = await this.prepareMessageToSend(chat);

    const openAIAnswer = await this.getOpenAIApi().createChatCompletion({
      messages: messageToSend,
      model: this.model,
      temperature: 0.7,
    });

    Logger.debug(`Messages from chat ${chatId} was sent to OpenAI`);
    const answerMessage = this.extractAnswer(chat, openAIAnswer.data);
    if (answerMessage) this._messageRepository.addMessage(answerMessage);

    Logger.info(
      `Message id: ${openAIAnswer.data.id} was included into chat ${chatId} and has been sent to openAI`,
    );

    return answerMessage;
  }
}
