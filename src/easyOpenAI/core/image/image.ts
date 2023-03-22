import { CreateImageRequestSizeEnum } from 'openai';
import { OpenAI } from '../openai.core';
import { writeFileSync } from 'fs';

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

  private async saveImageToPng(imageJson: string) {
    const imageData = imageJson.split(',')[1];
    const buffer = Buffer.from(imageData, 'base64');
    const fileName = `image-${Date.now()}.png`;
    writeFileSync(fileName, buffer);
  }

  public async generate({
    numberImages,
    size = '256x256',
  }: {
    numberImages: number;
    size: CreateImageRequestSizeEnum;
  }) {
    const result = await this.openAIApi.createImage({
      prompt: this.description,
      n: numberImages,
      size,
      response_format: 'url',
    });

    return result.data;
  }
}
