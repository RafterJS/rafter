import Rafter from './rafter';
import ConfigFileLoaderStrategy, { DEFAULT_FILENAMES } from './utils/ConfigFileLoaderStrategy';
import ConfigLoaderService from './utils/ConfigLoaderService';
import { IRafterOptions } from './IRafterOptions';

/**
 * This is a simple factory for Rafter that sets up all the basic stuff.
 *
 * @param {string=} appDirectory
 * @param {string=} configFileName
 * @param {string=} servicesFileName
 * @param {string=} pluginsFileName
 * @param {string=} middlewareFileName
 * @param {string=} routesFileName
 * @param {string=} preStartHooksFileName
 * @param {object=} logger
 * @param {boolean=} failOnError
 * @return {Rafter}
 */
export default ({
  appDirectory = `${__dirname}/../../`,
  configFileName = DEFAULT_FILENAMES.CONFIG,
  servicesFileName = DEFAULT_FILENAMES.SERVICES,
  pluginsFileName = DEFAULT_FILENAMES.PLUGINS,
  middlewareFileName = DEFAULT_FILENAMES.MIDDLEWARE,
  routesFileName = DEFAULT_FILENAMES.ROUTES,
  preStartHooksFileName = DEFAULT_FILENAMES.PRE_START_HOOKS,
  logger = console,
  failOnError = false,
}: IRafterOptions): Rafter => {
  const configFileLoaderStrategy = new ConfigFileLoaderStrategy({
    configFileName,
    servicesFileName,
    middlewareFileName,
    pluginsFileName,
    routesFileName,
    preStartHooksFileName,
    logger,
    failOnError,
  });

  const configLoaderService = new ConfigLoaderService(configFileLoaderStrategy, appDirectory, logger);

  return new Rafter({
    configLoaderService,
    logger,
  });
};

export { Rafter };
