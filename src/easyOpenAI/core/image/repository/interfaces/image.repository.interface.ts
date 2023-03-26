import { IImage } from '../../../../../infrastructure/image';

export interface IImageParams {
  imageId: string;
  ownerId: string;
  chatId: string;
}
export interface IImageRepository {
  get({ imageId, ownerId, chatId }: IImageParams): Promise<IImage | void>;
  delete({ imageId, ownerId, chatId }: IImageParams): Promise<IImage | void>;
  addImage(
    { chatId, ownerId }: { chatId: string; ownerId: string },
    { id, b64Data, description, createdAt }: IImage,
  ): Promise<IImage | void>;
}
