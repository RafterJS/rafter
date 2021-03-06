import { MethodActions } from './RouteMethodConstants';

export interface IRouteConfig {
  endpoint: string;
  controller: string;
  action?: string;
  method: MethodActions;
}

export type IRoutes = Set<IRouteConfig>;
