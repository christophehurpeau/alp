import 'pob-babel';
import type { Context } from 'alp-types';
import isModernBrowser from 'modern-browsers';
import type { ElementType, ReactElement } from 'react';
import React from 'react';
import { renderToString } from 'react-dom/server.js';
import { Helmet } from 'react-helmet';
// import Logger from 'nightingale-logger';
import createAlpAppWrapper from './createAlpAppWrapper';
import type { LayoutOptions } from './layout/htmlLayout';
import htmlLayout from './layout/htmlLayout';

export { Helmet } from 'react-helmet';
export { default as AlpModule } from './module/AlpModule';
export { default as SuspenseWrapper } from './module/SuspenseWrapper';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
export { default as LoadingFallbackContext } from './contexts/LoadingFallbackContext';

// const logger = new Logger( 'alp:react');

const renderHtml = (app: ReactElement, options: LayoutOptions): string => {
  const content = renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

interface Options {
  polyfillFeatures?: string;
  scriptName?: string | false;
  styleName?: string | false;
}

export type ReactAppCallback = (ctx: Context) => void;

export default function alpReact(
  App: ElementType<Record<string, never>>,
  options: Options = {},
): ReactAppCallback {
  return (ctx: Context): void => {
    const version: string = ctx.config.get('version');
    // TODO create alp-useragent with getter in context
    const ua = ctx.request.headers['user-agent'];
    const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

    const app = React.createElement(App);
    const WrappedApp = createAlpAppWrapper(app, ctx);

    ctx.body = renderHtml(React.createElement(WrappedApp), {
      version,
      scriptName: options.scriptName !== undefined ? options.scriptName : name,
      styleName: options.styleName !== undefined ? options.styleName : name,
      polyfillFeatures: options.polyfillFeatures,
      initialData: {
        sanitizedState: ctx.sanitizedState,
      },
    });
  };
}
