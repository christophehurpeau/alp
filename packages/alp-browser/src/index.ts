import { PRODUCTION } from 'pob-babel';
import config, { getConfig, existsConfig } from 'alp-browser-config';
import language from 'alp-browser-language';
import translate from 'alp-translate/browser';
import type {
  BrowserApplication as BrowserApplicationType,
  BrowserApplicationInCreation,
  BaseContext as AlpBaseContext,
  Context as AlpContext,
  Config,
  ContextState,
  RawConfig,
} from 'alp-types';
import Ibex from 'ibex';
import Logger from 'nightingale-logger';

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

declare module 'ibex' {
  interface BaseContext extends AlpBaseContext {}
  interface DefaultState extends ContextState {}
  interface Context extends AlpContext {}
}

const configPath = '/config';

export default class AlpBrowser
  extends Ibex
  implements BrowserApplicationInCreation {
  path: string;

  appVersion: string;

  constructor(path = '/', { version = window.__VERSION__ }: Options = {}) {
    super();
    this.path = path;
    this.appVersion = version;
  }

  config?: Config | undefined;

  async init(): Promise<BrowserApplication> {
    const configInstance = await config(
      this,
      PRODUCTION ? `/${this.appVersion}${configPath}` : configPath,
    );
    this.context.config = configInstance;

    language(this);
    await translate('/locales')(this);

    return (this as unknown) as BrowserApplication;
  }

  async existsConfig(name: string): Promise<boolean> {
    return existsConfig(`${configPath}${name}`);
  }

  loadConfig(name: string): Promise<RawConfig> {
    return getConfig(`${configPath}${name}`);
  }

  start(fn: () => Promise<void>): void {
    try {
      fn()
        .then(() => logger.success('started'))
        .catch((err: unknown) => logger.error('start fail', { err }));
    } catch (err: unknown) {
      logger.error('start fail', { err });
    }
  }
}

export const startApp = (
  callback: (app: BrowserApplication) => unknown,
): void => {
  const app = new AlpBrowser();

  return app.start(async () => {
    // init
    const browserApp = await app.init();
    await callback(browserApp);
  });
};
