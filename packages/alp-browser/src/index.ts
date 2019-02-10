import Ibex from 'ibex';
import config, { getConfig, existsConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import Logger from 'nightingale-logger';
import {
  BrowserApplication as BrowserApplicationType,
  BrowserApplicationInCreation,
} from 'alp-types';

export type BrowserApplication = BrowserApplicationType;

const logger = new Logger('alp');

declare global {
  interface Window {
    __VERSION__: string;
  }
}

interface Options {
  version?: string; // default to window.__VERSION__
}
const configPath = '/config';

export default class AlpBrowser extends Ibex
  implements BrowserApplicationInCreation {
  path: string;

  appVersion: string;

  constructor(path = '/', { version = window.__VERSION__ }: Options = {}) {
    super();
    this.path = path;
    this.appVersion = version;
  }

  async init(): Promise<BrowserApplication> {
    await config(this, configPath);

    language(this);
    await translate('/locales')(this);

    return (this as unknown) as BrowserApplication;
  }

  existsConfig(name: string) {
    return existsConfig(`${configPath}${name}`);
  }

  loadConfig(name: string) {
    return getConfig(`${configPath}${name}`);
  }

  start(fn: Function) {
    try {
      fn()
        .then(() => logger.success('started'))
        .catch((err: any) => logger.error('start fail', { err }));
    } catch (err) {
      logger.error('start fail', { err });
    }
  }
}
