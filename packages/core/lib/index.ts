import Rafter from './rafter';
import ConfigAutoloaderService from './utils/ConfigAutoloaderService';

/**
 * This is a simple factory for Rafter that sets up all the basic stuff.
 *
 * @param {string=} appDirectory
 * @param {string=} configFileName
 * @param {string=} servicesFileName
 * @param {string=} middlewareFileName
 * @param {string=} routesFileName
 * @param {string=} preStartHooksFileName
 * @param {object=} logger
 * @return {Rafter}
 */
export default ({
  appDirectory = `${__dirname}/../../`,
  configFileName = `.config.js`,
  servicesFileName = `.services.js`,
  middlewareFileName = `.middleware.js`,
  routesFileName = `.routes.js`,
  preStartHooksFileName = `.pre-start-hooks.js`,
  logger = console,
}): Rafter => {
  const configAutoloaderService = new ConfigAutoloaderService({
    configFileName,
    servicesFileName,
    middlewareFileName,
    routesFileName,
    preStartHooksFileName,
    logger,
  });

  return new Rafter({
    appDirectory,
    configAutoloaderService,
    logger,
  });
};

export { Rafter };
