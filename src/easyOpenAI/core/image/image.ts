export class Image {
  private _description: string;

  constructor({ description }: { description: string }) {
    this._description = description;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }
}
