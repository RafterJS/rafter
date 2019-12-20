import { IMiddlewareConfig } from '../../common/middleware/IMiddleware';
import { IRouteConfig } from '../../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../../common/pre-start-hooks/IPreStartHook';
import { IServiceConfig } from '../../common/IService';
import { IConfig } from './IConfig';
import { IPluginsConfig } from '../../common/plugins/IPlugin';
import { mergeDiConfig } from './configHelpers';

/**
 * A config dto which holds information about services, middleware, routes and misc config. This is
 * used primarily for the autoloaders and to be put into the DI container for later use by
 * services.
 *
 * @return {DiConfigDto}
 */
export default class DiConfigDto implements IConfig {
  private config: object = {};

  private services: IServiceConfig = {};

  private middleware: IMiddlewareConfig[] = [];

  private routes: IRouteConfig[] = [];

  private preStartHooks: IPreStartHookConfig[] = [];

  private pluginsConfig: IPluginsConfig = {};

  constructor(...configDtos: IConfig[]) {
    if (configDtos) {
      mergeDiConfig(this, ...configDtos);
    }
  }

  public getConfig(): object {
    return this.config;
  }

  public addConfig(newConfig: object): DiConfigDto {
    this.config = {
      ...newConfig,
      ...this.config,
    };
    return this;
  }

  public getPreStartHooks(): IPreStartHookConfig[] {
    return this.preStartHooks;
  }

  public addPreStartHooks(newPreStartHooks: IPreStartHookConfig[] = []): DiConfigDto {
    this.preStartHooks = [...this.preStartHooks, ...newPreStartHooks];
    return this;
  }

  public getServices(): IServiceConfig {
    return this.services;
  }

  public addServices(newServices: IServiceConfig = {}): DiConfigDto {
    this.services = {
      ...this.services,
      ...newServices,
    };
    return this;
  }

  public getMiddleware(): IMiddlewareConfig[] {
    return this.middleware;
  }

  public addMiddleware(newMiddleware: IMiddlewareConfig[] = []): DiConfigDto {
    this.middleware = [...this.middleware, ...newMiddleware];
    return this;
  }

  public getRoutes(): IRouteConfig[] {
    return this.routes;
  }

  public addRoutes(newRoutes: IRouteConfig[] = []): DiConfigDto {
    this.routes = [...this.routes, ...newRoutes];
    return this;
  }

  public getPluginsConfig(): IPluginsConfig {
    return this.pluginsConfig;
  }

  public addPluginsConfig<T>(pluginsConfig: IPluginsConfig = {}): DiConfigDto {
    for (const [pluginName, pluginConfig] of Object.entries(pluginsConfig)) {
      if (!this.pluginsConfig[pluginName]) {
        this.pluginsConfig[pluginName] = pluginConfig;
      }
    }

    return this;
  }
}