import { randomUUID } from 'crypto';
import {
  CreateChatCompletionResponse,
  CreateImageRequestResponseFormatEnum,
  CreateImageRequestSizeEnum,
} from 'openai';
import { Logger } from 'traceability';
import {
  IChat,
  IChatCompletionMessage,
  IChatCompletionMessageBase,
  IChatRepository,
  IMessageRepository,
  OpenAI,
} from '..';
import { ImageRepository } from '../../../infrastructure';

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

export enum ECommand {
  'CREATE IMAGE',
  'UPDATE_IMAGE',
}

export interface ICommand {
  command: ECommand;
  pattern: RegExp;
}

export interface IAssistant {
  repositories: {
    chatRepository: IChatRepository;
    messageRepository: IMessageRepository;
    imageRepository: ImageRepository;
  };
  params?: {
    name?: string;
    humor?: EHumor;
    model?: EModel;
    id?: string;
  };
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

  _imageRepository: ImageRepository;

  constructor({ repositories, params }: IAssistant) {
    if (params) {
      this.name = params.name || this.name;
      this.humor = params.humor || this.humor;
      this.id = params.id || this.id;
      this.model = params.model || this.model;
    }
    this._chatRepository = repositories.chatRepository;
    this._messageRepository = repositories.messageRepository;
    this._imageRepository = repositories.imageRepository;
    this.setup();
  }

  private setup() {
    this.context.splice(0);
    this.context.push({
      role: 'system',
      content: `Your name is ${this.name} and You have a ${this.humor} humor`,
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

    //TODO: Só enviar se existir uma nova mensagem, não comando, que não foi enviada.
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

  async createImages({
    numberImages = 1,
    size = '256x256',
    description,
  }: {
    numberImages?: number;
    size?: CreateImageRequestSizeEnum;
    description: string;
  }) {
    const response_format: CreateImageRequestResponseFormatEnum = 'b64_json';

    try {
      const result = await this.getOpenAIApi().createImage({
        prompt: description,
        n: numberImages,
        size,
        response_format,
      });

      const images = result.data.data;
      const createdAt = result.data.created;

      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        if (image.b64_json)
          this._imageRepository.addImage({
            description,
            b64Data: image.b64_json,
            id: randomUUID(),
            createdAt,
          });
      }
      return true;
    } catch (error: any) {
      Logger.error(error.message, {
        eventName: 'createImages',
        eventData: { numberImages, size, description },
      });
      return false;
    }
  }
}