export class MadreHttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly response: any,
    message: string
  ) {
    super(message);
  }
}
