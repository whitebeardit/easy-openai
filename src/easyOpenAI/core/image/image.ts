import {
  CreateImageRequestResponseFormatEnum,
  CreateImageRequestSizeEnum,
} from 'openai';
import { OpenAI } from '../openai.core';
export class Image {
  private _description: string;

  private _openAIApi = OpenAI.getInstance().getOpenAI();

  public get openAIApi() {
    return this._openAIApi;
  }

  constructor({ description }: { description: string }) {
    this._description = description;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public async generate({
    numberImages = 1,
    size = '256x256',
    response_format = 'b64_json',
  }: {
    numberImages?: number;
    size?: CreateImageRequestSizeEnum;
    response_format?: CreateImageRequestResponseFormatEnum;
  }) {
    const result = await this.openAIApi.createImage({
      prompt: this.description,
      n: numberImages,
      size,
      response_format,
    });

    return result.data;
  }
}
