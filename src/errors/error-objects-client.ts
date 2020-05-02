export class ErrorObjectsClient extends Error {
  public code: string;
  constructor(message, public params?: any[]) {
    super(message);
    this.name = this.constructor.name;
    this.code = this.name;
  }
}
