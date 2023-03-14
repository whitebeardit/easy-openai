import { randomUUID } from 'crypto';
import { CreateChatCompletionResponse } from 'openai';
import { Logger } from 'traceability';
import {
  Chat,
  IChatCompletionMessage,
  IChatCompletionMessageBase,
  IChatRepository,
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
}

export class Assistant {
  private _id: string = randomUUID();

  private _name = 'Whitebeard';

  private _humor: EHumor = EHumor.SARCASTIC;

  private _model: EModel = EModel['GPT-3.5-TURBO'];

  private _openAIApi = OpenAI.getInstance().getOpenAI();

  context: IChatCompletionMessageBase[] = [];

  _chatRepository: IChatRepository;

  constructor(
    chatRepository: IChatRepository,
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
    this.setup();
  }

  private setup() {
    this.context.splice(0);
    this.context.push(
      {
        role: 'system',
        content: `You are a ${this.humor} assistant.`,
        ownerId: 'Whitebeard',
      },
      {
        role: 'system',
        content: `Your name is ${this.name}.`,
        ownerId: 'Whitebeard',
      },
    );
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

  async addChat({ chat }: { chat: Chat }) {
    await this._chatRepository.addChat({ chat });
  }

  async getChat({ chatId }: { chatId: string }) {
    return this._chatRepository.getChat({ chatId });
  }

  async getChats(ownerIdId: string, params?: { skip: number; limit: number }) {
    return this._chatRepository.getChats(ownerIdId, params);
  }

  getOpenAIApi() {
    return this._openAIApi;
  }

  private extractAnswer(chat: Chat, answer: CreateChatCompletionResponse) {
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
      };
      return answerMessage;
    } catch (error: any) {
      Logger.error(error.message);
      return;
    }
  }

  private async prepareMessageToSend(chat: Chat) {
    Logger.info('Preparing messages to send ...');
    const messages = [...this.context, ...(await chat.getMessages())];
    const messageToSend = messages.map((m) => {
      return { role: m.role, content: m.content, name: m.ownerId };
    });
    return messageToSend;
  }

  async sendMessage({
    chatId,
  }: {
    chatId: string;
  }): Promise<IChatCompletionMessage | undefined> {
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
    if (answerMessage) chat.addMessage(answerMessage);

    Logger.info(
      `Message id: ${openAIAnswer.data.id} was included into chat ${chatId} and has been sent to openAI`,
    );

    return answerMessage;
  }
}
