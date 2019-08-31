import { BrowserApplicationInCreation, Context } from 'alp-types';
import load from './load';

export default function alpTranslate(dirname: string) {
  dirname = dirname.replace(/\/*$/, '/');
  return (app: BrowserApplicationInCreation) => {
    const language = app.context.language;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return app.loadConfig(dirname + language).then((map) => {
      const translations = load(map, language);

      Object.assign(app.context, {
        t(this: Context, key: string, args?: { [key: string]: any }): string {
          const msg = translations.get(key);
          if (!msg) return key;
          return msg.format(args);
        },
      });

      return map;
    });
  };
}
