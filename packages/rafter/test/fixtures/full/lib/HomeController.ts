import { Request, Response } from 'express';
import { IController } from '../../../../lib/common/router';

type IHomeController = IController;

export default class HomeController implements IHomeController {
  public index(request: Request, response: Response): void {
    response.send(`
    Hi this is the home controller. 
    We have autoloaded all the routes and services.
       <br>
      <br>
      <a href="/other">Go to another page</a>
       <br>
      <br>
      You can also implement JSON endpoints in exactly the same way as normal pages.
      <a href="/api">See the API</a>
    `);
  }
}
