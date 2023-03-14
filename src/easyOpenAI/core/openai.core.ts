import { Configuration, OpenAIApi } from 'openai';
import { Logger } from 'traceability';

export class OpenAI {
  private static _instance: OpenAI;

  private readonly openai: OpenAIApi;

  private configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  });

  private constructor() {
    this.openai = new OpenAIApi(this.configuration);
    console.info('OpenAIApi configured', { configuration: this.configuration });

    Logger.info('OpenAIApi Instanced');
  }

  public static getInstance() {
    return this._instance || (this._instance = new this());
  }

  public getOpenAI() {
    return this.openai;
  }
}
