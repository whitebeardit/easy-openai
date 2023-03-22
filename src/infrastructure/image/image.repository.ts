import { writeFileSync, readFileSync } from 'fs';
import { IImageRepository } from '../../easyOpenAI/core/image/repository/interfaces/image.repository.interface';

export class ImageRepository implements IImageRepository {
  private _baseDir;

  public get baseDir() {
    return this._baseDir;
  }

  public set baseDir(value) {
    this._baseDir = value;
  }

  constructor(baseDir: string) {
    this._baseDir = baseDir;
  }

  save(b64Data: string): Promise<string> {
    const buffer = Buffer.from(b64Data, 'base64');
    const fileName = `${this.baseDir}/image-${Date.now()}.png`;
    writeFileSync(fileName, buffer);
    return Promise.resolve(fileName);
  }

  _readImgBase64(imgPath: string): string {
    const imgFile = readFileSync(imgPath);
    const img = Buffer.from(imgFile).toString('base64');
    return img;
  }

  get(uri: string): Promise<string> {
    return Promise.resolve(this._readImgBase64(uri));
  }
}
