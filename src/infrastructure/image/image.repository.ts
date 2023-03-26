import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { Logger } from 'traceability';
import {
  IImageParams,
  IImageRepository,
} from '../../easyOpenAI/core/image/repository/interfaces/image.repository.interface';

export interface IImage extends Omit<IImageMetadata, 'chatId' | 'ownerId'> {
  b64Data: string;
}

export interface IImageMetadata {
  id: string;
  description: string;
  createdAt: number;
  ownerId: string;
  chatId: string;
}

export class ImageRepository implements IImageRepository {
  private readonly _baseDir;

  _imagesMetadata: IImageMetadata[] = [];

  constructor(baseDir: string) {
    this._baseDir = baseDir;
  }

  private _createDir(directory: string) {
    return mkdirSync(directory, { recursive: true });
  }

  public get baseDir() {
    return this._baseDir;
  }

  private _getFilename(id: string) {
    return `${this.baseDir}/${id}.png`;
  }

  private _save({ id, b64Data }: { b64Data: string; id: string }): string {
    this._createDir(this.baseDir);

    const buffer = Buffer.from(b64Data, 'base64');
    const fileName = this._getFilename(id);
    writeFileSync(fileName, buffer);
    return fileName;
  }

  private _readImgBase64(imgPath: string): string {
    const imgFile = readFileSync(imgPath);
    const b64Data = Buffer.from(imgFile).toString('base64');
    return b64Data;
  }

  async addImage(
    { chatId, ownerId }: { chatId: string; ownerId: string },
    { id, b64Data, description, createdAt }: IImage,
  ): Promise<IImage | void> {
    try {
      const imageExist = this._imagesMetadata.find(
        (i) => i.id === id && i.chatId === chatId && i.ownerId === ownerId,
      );
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
      this._save({ id, b64Data });
      this._imagesMetadata.push({
        createdAt,
        description,
        id,
        chatId,
        ownerId,
      });

      return imageStored;
    } catch (error: any) {
      Logger.error(error.message, {
        eventName: 'addImage',
        eventData: { id, b64Data, description, createdAt },
      });
      return;
    }
  }

  async get({
    imageId,
    ownerId,
    chatId,
  }: IImageParams): Promise<IImage | void> {
    const imageExist = this._imagesMetadata.find(
      (i) => i.id === imageId && i.chatId === chatId && i.ownerId === ownerId,
    );
    if (!imageExist) {
      return;
    }
    const filename = this._getFilename(imageId);
    const imageStored: IImage = {
      ...imageExist,
      b64Data: await this._readImgBase64(filename),
    };

    return imageStored;
  }

  async delete({ imageId, ownerId, chatId }: IImageParams) {
    const index = this._imagesMetadata.findIndex(
      (i) => i.id === imageId && i.chatId === chatId && i.ownerId === ownerId,
    );
    if (index < 0) {
      return;
    }
    const imageExist = this._imagesMetadata[index];
    const filename = this._getFilename(imageId);
    const imgDeleted: IImage = {
      ...imageExist,
      b64Data: this._readImgBase64(filename),
    };
    this._imagesMetadata.splice(index);
    unlinkSync(filename);

    return imgDeleted;
  }

  async getImagesMetadata(
    ownerId: string,
    chatId: string,
    params?: {
      skip: number;
      limit: number;
    },
  ): Promise<IImageMetadata[]> {
    let result = this._imagesMetadata;
    if (params) {
      if (params.skip < 0) {
        throw new Error('skip should be >= 0!');
      }
      if (params.limit < 0) {
        throw new Error('limit should be >= 0!');
      }

      if (params.limit > result.length) {
        params.limit = result.length;
      }

      if (params.skip >= result.length) {
        result = [];
      } else {
        result = result.slice(params.skip, params.skip + params.limit);
      }
    }
    return result;
  }
}
