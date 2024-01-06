import { Logger } from 'nightingale-logger';
import type { AlpNodeApp, Context } from '../AlpNodeApp';
import type { Translations } from './load';
import load from './load';

const logger = new Logger('alp:translate');

type Args = Record<string, any>;

export interface TranslateBaseContext {
  t: (id: string, args: Args) => string;
}
export interface TranslateContext {
  readonly language: string;
}

export default function alpTranslate(
  dirname: string,
): (app: AlpNodeApp) => void {
  dirname = dirname.replace(/\/*$/, '/');
  return (app: AlpNodeApp) => {
    const appTranslations = new Map<string, Translations>();

    Object.assign(app.context, {
      t(this: Context, id: string, args: Args): string {
        const msg = appTranslations.get(this.language)!.get(id);
        if (!msg) {
          logger.warn('invalid msg', { language: this.language, id });
          return id;
        }

        return msg.format(args) as string;
      },
    });

    const config = app.config;

    config.get<string[]>('availableLanguages').forEach((language) => {
      const translations = app.loadConfigSync(dirname + language);
      appTranslations.set(language, load(translations, language));
    });

    return appTranslations;
  };
}
