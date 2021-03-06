import { ILogger } from '@rafterjs/logger-plugin';
import { GlobWithOptions } from 'awilix';
import { IMergableFileNames, IPaths } from '@rafterjs/di-autoloader';

export interface IRafterOptions {
  corePath?: GlobWithOptions | string;

  mergableFileNames?: IMergableFileNames;

  paths?: IPaths;

  logger?: ILogger;
}
