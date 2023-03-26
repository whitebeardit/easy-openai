import { IImage } from '../../../../../infrastructure/image';

export interface IImageRepository {
  get(id: string): Promise<IImage | void>;
  delete(id: string): Promise<IImage | void>;
  addImage({
    id,
    b64Data,
    description,
    createdAt,
  }: IImage): Promise<IImage | void>;
}
