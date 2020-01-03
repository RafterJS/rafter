/* eslint-disable @typescript-eslint/ban-ts-ignore */
import isFunction from 'lodash/isfunction';
import cloneDeep from 'lodash/clonedeep';
import get from 'lodash/get';
import isUndefined from 'lodash/isundefined';
import find from 'lodash/find';
import forEach from 'lodash/foreach';
import { ILogger, LogLevel } from '@rafter/utils';
import { IServiceProvider, ServiceProvider } from './ServiceProvider';
import { FactoryProvider, IFactory, IFactoryClass, IFactoryProvider, LengthWise, Service } from './FactoryProvider';
import { IScope } from './ScopeConstants';

type IContainer = Map<string, IServiceProvider<Service>>;

class Box {
  private readonly container: IContainer;

  private readonly factoryProviders: IFactoryProvider<Service>[];

  private logger: ILogger;

  constructor(
    container: IContainer = new Map(),
    factories: IFactoryProvider<Service>[] = [],
    logger: ILogger = console,
  ) {
    this.container = container;
    this.factoryProviders = factories;
    this.logger = logger;
  }

  public register<T extends Service>(
    serviceName: string,
    factory: IFactory<T>,
    dependencies: string[],
    isInvokable = false,
  ): void {
    let factoryProvider: IFactoryProvider<T>;

    // check for the factory pattern
    if (isFunction((factory as IFactoryClass<T>).createInstance)) {
      factoryProvider = this.getFactoryProvider<T>((factory as IFactoryClass<T>).createInstance);

      this.logger.log(
        LogLevel.DEBUG,
        `Registering service provider for '${serviceName}' using the factory pattern with ` +
        `${dependencies ? dependencies.length : 'no'} dependencies`,
      );
    } else if (!isUndefined(factory)) {
      factoryProvider = new FactoryProvider<T>(factory, dependencies);

      this.logger.log(
        LogLevel.DEBUG,
        `Registering service provider for '${serviceName}' with ` +
        `${dependencies ? dependencies.length : 'no'} dependencies`,
      );
    } else {
      const err = `The arguments for ${serviceName} are not valid`;
      this.logger.error(err);
      throw new Error(err);
    }

    this.registerProvider(serviceName, factoryProvider, isInvokable);
  }

  public registerInvokable<T extends Service>(
    serviceName: string,
    serviceFactory: IFactoryProvider<T>,
    dependencies: string[],
  ): void {
    this.register(serviceName, serviceFactory, dependencies, true);
  }

  public get<T extends Service>(name: string): T {
    this.logger.log(LogLevel.DEBUG, `Getting service '${name}'`);
    let deepObjectProperty: string;

    // check if the service name is actually requesting some deep properties.
    if (name.includes('.')) {
      deepObjectProperty = name
        .split('.')
        .slice(1)
        .join('.');
      name = name.split('.')[0]; // eslint-disable-line
    }

    const provider = this.getProvider<T>(name);
    const factoryProvider = provider.getFactoryProvider();
    let instance: T | undefined = provider.getInstance();

    if (!factoryProvider) {
      throw new Error(
        `The factory for '${name}' does not exist. Please ensure that you registered the service correctly.`,
      );
    }

    if (isUndefined(instance) || !factoryProvider.isSingleton()) {
      // check if the instance is already defined or if it's not a singleton
      if (!factoryProvider.isSingleton()) {
        this.logger.log(
          LogLevel.DEBUG,
          `The service '${name}' is not a singleton, creating a new instance now...`,
        );
      } else {
        this.logger.log(
          LogLevel.DEBUG,
          `No existing instance found for service '${name}', creating one now...`,
        );
      }

      // resolve the dependencies if they haven't been already
      if (!provider.hasResolvedDependencies()) {
        this.resolveProviderDependencies(provider);
      }

      // get the provider dependencies
      const dependencies = provider.getDependencies();
      const factory = factoryProvider.getFactory();

      // we can only check the argument length of functions, not class constructors
      // TODO, figure out a way to test number of arguments in a class constructor
      if (isFunction(factoryProvider) && (factory as LengthWise).length !== dependencies.length) {
        throw new Error(`Module ${name} factory function arguments don't match the passed
            dependencies`);
      }

      // invoke the factory
      if (provider.isInvokable()) {
        this.logger.log(LogLevel.DEBUG, `Invoking an instance for the provider '${name}'`);

        const invokableDependencies = cloneDeep(dependencies);
        invokableDependencies.unshift((null as unknown) as object);

        instance = new (Function.prototype.bind.apply(factory as Function, invokableDependencies))();
      } else if (isFunction(factory)) {
        this.logger.log(
          LogLevel.DEBUG,
          `Calling the factory for the provider '${name}'`,
          factory,
        );

        instance = factory(...dependencies);
      } else {
        this.logger.log(LogLevel.DEBUG, `Assigning the factory to the provider '${name}'`);
        instance = factory;
      }

      // save the instance back to the container
      if (!isUndefined(instance) && factoryProvider.isSingleton()) {
        this.logger.log(LogLevel.DEBUG, `Saving the instance back to '${name}'`);
        provider.setInstance(instance);
      }
    }

    // return the deep object instead
    // @ts-ignore
    if (deepObjectProperty) {
      return get(instance, deepObjectProperty);
    }

    if (!instance) {
      throw new Error(`Instance is not defined for name: ${name}`);
    }

    return instance;
  }

  /**
   * Remove the provider from the container.
   *
   * @param {String} name
   */
  public remove(name: string): void {
    if (this.container.has(name)) {
      this.container.delete(name);
      this.logger.log(LogLevel.DEBUG, `Removed the provider '${name}' from the container`);
    } else {
      this.logger.log(
        LogLevel.WARNING,
        `Could not remove the provider '${name}' as it does not exist in the container`,
      );
    }
  }

  /**
   * Removes all providers in this container.
   */
  public reset(): void {
    this.container.clear();
  }

  public registerFactory<T extends Service>(
    factory: IFactory<T>,
    dependencies: string[] = [],
    scope?: IScope,
  ): IFactoryProvider<T> {
    if (this.isFactoryRegistered(factory)) {
      throw new Error(`Module ${factory} is already registered. Use swap() instead.`);
    }

    const factoryProvider = new FactoryProvider(factory, dependencies, scope);
    this.factoryProviders.push(factoryProvider);
    return factoryProvider;
  }

  public isFactoryRegistered<T extends Service>(factory: IFactory<T>): boolean {
    const registeredFactory = this.getFactoryProvider(factory);
    return !!registeredFactory;
  }

  /**
   * @param {FactoryInterface} factory
   * @returns {FactoryProvider}
   * @public
   */
  public getFactoryProvider<T extends Service>(factory: IFactory<T>): IFactoryProvider<T> | undefined {
    return this.factoryProviders.find(
      registeredFactoryProvider => factory === registeredFactoryProvider.getFactory(),
    ) as IFactoryProvider<T>;
  }

  /**
   *
   * @param factory
   * @param scope
   */
  public setFactoryScope<T extends Service>(factory: IFactory<T>, scope: IScope): void {
    let factoryProvider: IFactoryProvider<T>;

    if (!this.isFactoryRegistered(factory)) {
      factoryProvider = this.registerFactory<T>(factory);
    } else {
      factoryProvider = this.getFactoryProvider<T>(factory);
    }

    factoryProvider.setScope(scope);
  }

  public setFactoryDependencies<T extends Service>(factory: IFactory<T>, dependencies: string[] = []): void {
    let factoryProvider: IFactoryProvider<T>;

    if (!this.isFactoryRegistered(factory)) {
      factoryProvider = this.registerFactory<T>(factory);
    } else {
      factoryProvider = this.getFactoryProvider<T>(factory);
    }

    factoryProvider.setDependencies(dependencies);
  }

  public setLogger(logger: ILogger): void {
    this.logger = logger;
  }

  private registerProvider<T extends Service>(
    serviceName: string,
    factoryProvider: IFactoryProvider<T>,
    isInvokable = false,
  ): void {
    if (this.container.has(serviceName)) {
      throw new Error(`Module ${serviceName} is already registered. Use swap() instead.`);
    }
    this.container.set(serviceName, new ServiceProvider<T>(serviceName, factoryProvider, isInvokable));
  }

  private getProvider<T extends Service>(name: string): IServiceProvider<T> {
    const serviceProvider = this.container.get(name);

    if (serviceProvider === undefined) {
      this.logger.error(`Could not find the service '${name}'`);
      throw new Error(`Service ${name} not found`);
    }

    return serviceProvider as IServiceProvider<T>;
  }

  /**
   * @param {ServiceProvider} serviceProvider
   * @return {Array}
   * @private
   */
  private resolveProviderDependencies<T extends Service>(serviceProvider: IServiceProvider<T>): void {
    const factoryProvider = serviceProvider.getFactoryProvider();

    forEach(factoryProvider.getDependencies(), dependencyName => {
      if (dependencyName !== serviceProvider.getName()) {
        const dependency = this.get(dependencyName);

        serviceProvider.addDependency(dependency);
      } else {
        throw new Error(`The service ${serviceProvider.getName()} cannot depend on itself`);
      }
    });

    serviceProvider.setResolvedDependencies(true);
  }
}

export default new Box();
export { Box };
