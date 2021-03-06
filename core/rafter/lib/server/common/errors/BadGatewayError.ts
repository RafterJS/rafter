import { Status } from '../response';
import { HttpError } from './HttpError';

export class BadGatewayError extends HttpError {
  constructor(message = `Bad Gateway`) {
    super(Status.BAD_GATEWAY, message);
    this.name = 'Bad Gateway';
  }
}
