import fs from 'fs/promises';
import { Logger } from 'traceability';
import { IImageRepository } from '../../easyOpenAI/core/image/repository/interfaces/image.repository.interface';

export interface IImage extends IImageMetadata {
  b64Data: string;
}

export interface IImageMetadata {
  id: string;
  description: string;
  createdAt: number;
}

export class ImageRepository implements IImageRepository {
  private readonly _baseDir;

  private images: Omit<IImage, 'b64Data'>[] = [];

  constructor(baseDir: string) {
    this._createDir(baseDir);
    this._baseDir = baseDir;
  }

  private async _createDir(directory: string) {
    return fs.mkdir(directory, { recursive: true });
  }

  public get baseDir() {
    return this._baseDir;
  }

  private _getFilename(id: string) {
    return `${this.baseDir}/${id}.png`;
  }

  private async _save({
    id,
    b64Data,
  }: {
    b64Data: string;
    id: string;
  }): Promise<string> {
    const buffer = Buffer.from(b64Data, 'base64');
    const fileName = this._getFilename(id);
    await fs.writeFile(fileName, buffer);
    return fileName;
  }

  private async _readImgBase64(imgPath: string): Promise<string> {
    const imgFile = await fs.readFile(imgPath);
    const b64Data = Buffer.from(imgFile).toString('base64');
    console.info({ b64Data, imgPath });
    return b64Data;
  }

  async addImage({
    id,
    b64Data,
    description,
    createdAt,
  }: IImage): Promise<IImage | void> {
    try {
      const imageExist = this.images.find((i) => i.id === id);
      if (imageExist) {
        throw new Error('Image Already exist!');
      }

      const imageStored: IImage = {
        id,
        b64Data,
        description,
        createdAt,
      };
      //The image data is saved in filesystem. We Keep in memory only metadata
      await this._save({ id, b64Data });
      this.images.push({ createdAt, description, id });

      return imageStored;
    } catch (error: any) {
      Logger.error(error.message, {
        eventName: 'addImage',
        eventData: { id, b64Data, description, createdAt },
      });
      return;
    }
  }

  async get(id: string): Promise<IImage | void> {
    const imageExist = this.images.find((i) => i.id === id);
    if (!imageExist) {
      return;
    }
    const filename = this._getFilename(id);
    const imageStored: IImage = {
      ...imageExist,
      b64Data: await this._readImgBase64(filename),
    };

    return imageStored;
  }

  async delete(id: string) {
    const index = this.images.findIndex((i) => i.id === id);
    if (index < 0) {
      return;
    }
    const imageExist = this.images[index];
    const filename = this._getFilename(id);
    const imageStored: IImage = {
      ...imageExist,
      b64Data: await this._readImgBase64(filename),
    };
    this.images.splice(index);
    await fs.unlink(filename);

    return imageStored;
  }
}
