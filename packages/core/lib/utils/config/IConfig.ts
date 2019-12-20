import { IMiddlewareConfig } from '../../common/middleware/IMiddleware';
import { IRouteConfig } from '../../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../../common/pre-start-hooks/IPreStartHook';
import { IServiceConfig } from '../../common/IService';
import { IPluginsConfig } from '../../common/plugins/IPlugin';

/**
 * IConfig = the config for the rafter server and the plugin specific config
 * IPluginsConfig = IConfig
 * DiServiceConfig
 */

export interface IConfig {
  getConfig(): object;

  addConfig(newConfig: object): IConfig;

  getPreStartHooks(): IPreStartHookConfig[];

  addPreStartHooks(newPreStartHooks: IPreStartHookConfig[]): IConfig;

  getServices(): IServiceConfig;

  addServices(newServices: IServiceConfig): IConfig;

  getMiddleware(): IMiddlewareConfig[];

  addMiddleware(newMiddleware: IMiddlewareConfig[]): IConfig;

  getRoutes(): IRouteConfig[];

  addRoutes(newRoutes: IRouteConfig[]): IConfig;

  getPluginsConfig(): IPluginsConfig;

  addPluginsConfig(pluginsConfig: IPluginsConfig): IConfig;
}

export type IConfigTypes = IPreStartHookConfig
  | IServiceConfig
  | IMiddlewareConfig
  | IRouteConfig
  | IPluginsConfig
  | object;