import { IPreStartHookConfig } from 'rafter';

export default (): IPreStartHookConfig[] => ['connectMongoDb'];