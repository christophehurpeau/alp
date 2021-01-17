import type { NodeApplicationInCreation, Context } from 'alp-types';
import Logger from 'nightingale-logger';
import type { Translations } from './load';
import load from './load';

const logger = new Logger('alp:translate');

interface Args {
  [key: string]: any;
}

declare module 'alp-types' {
  interface BaseContext {
    t: (id: string, args: Args) => string;
  }
  interface Context {
    readonly language: string;
  }
}

export default function alpTranslate(
  dirname: string,
): (app: NodeApplicationInCreation) => void {
  dirname = dirname.replace(/\/*$/, '/');
  return (app: NodeApplicationInCreation) => {
    const appTranslations = new Map<string, Translations>();

    Object.assign(app.context, {
      t(this: Context, id: string, args: Args): string {
        const msg = (appTranslations.get(this.language) as Translations).get(
          id,
        );
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, id });
          return id;
        }

        return msg.format(args) as string;
      },
    });

    const config = app.config as NonNullable<typeof app.config>;

    config.get<string[]>('availableLanguages').forEach((language) => {
      const translations = app.loadConfigSync(dirname + language);
      appTranslations.set(language, load(translations, language));
    });

    return appTranslations;
  };
}
