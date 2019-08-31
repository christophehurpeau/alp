import Logger from 'nightingale-logger';
import { NodeApplicationInCreation, Context } from 'alp-types';
import load from './load';

const logger = new Logger('alp:translate');

interface Args {
  [key: string]: any;
}

declare module 'alp-types' {
  interface Context {
    t: (id: string, args: Args) => string;
  }
}

export default function alpTranslate(dirname: string) {
  dirname = dirname.replace(/\/*$/, '/');
  return (app: NodeApplicationInCreation) => {
    const appTranslations = new Map();

    Object.assign(app.context, {
      t(this: Context, id: string, args: Args): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const msg = appTranslations.get(this.language).get(id);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, id });
          return id;
        }

        return msg.format(args);
      },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    app.config.get('availableLanguages').forEach((language: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const translations = app.config.loadConfigSync(dirname + language);
      appTranslations.set(language, load(translations, language));
    });

    return appTranslations;
  };
}
