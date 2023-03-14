import { Configuration, OpenAIApi } from 'openai';
import { Logger } from 'traceability';
import * as env from '../../configurations/env-constants';

export class OpenAI {
  private static _instance: OpenAI;

  private readonly openai: OpenAIApi;

  private configuration = new Configuration({
    organization: env.OPENAI_ORGANIZATION,
    apiKey: env.OPENAI_API_KEY,
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
