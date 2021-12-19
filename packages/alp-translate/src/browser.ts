import type { BrowserApplicationInCreation, Context } from 'alp-types';
import load from './load';

type Args = Record<string, any>;

declare module 'alp-types' {
  interface BaseContext {
    language: string;
    t: (id: string, args: Args) => string;
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow,  @typescript-eslint/no-empty-interface
  interface Context {}
}

export default function alpTranslate(
  dirname: string,
): (app: BrowserApplicationInCreation) => Promise<void> {
  dirname = dirname.replace(/\/*$/, '/');
  return async (app: BrowserApplicationInCreation): Promise<void> => {
    const language = app.context.language;

    const map = await app.loadConfig(dirname + language);
    const translations = load(map, language);

    Object.assign(app.context, {
      t(this: Context, key: string, args?: Record<string, any>): string {
        const msg = translations.get(key);
        if (!msg) return key;
        return msg.format(args) as string;
      },
    });
  };
}
