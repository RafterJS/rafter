/**
 * An extension of the javascript error class for http errors.
 */
export class HttpError extends Error {
  private readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  /**
   * The http status code.
   */
  public getStatus(): number {
    return this.status;
  }

  /**
   * The http error message
   */
  public getMessage(): string {
    return this.message;
  }
}
