export interface IImageRepository {
  save(b64_json: string): Promise<string>;
  get(uri: string): Promise<string>;
}
