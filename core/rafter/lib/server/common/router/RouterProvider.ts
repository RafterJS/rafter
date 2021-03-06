import * as Express from 'express';
import { IRouter } from 'express-serve-static-core';

export interface IRouterProvider {
  createInstance(): IRouter;
}

/**
 * A provider that creates new router instances
 */
export class RouterProvider implements IRouterProvider {
  public createInstance(): IRouter {
    return Express.Router();
  }
}

export default RouterProvider;
