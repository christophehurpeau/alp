import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
// import Logger from 'nightingale-logger';
import createIsModernBrowser from 'modern-browsers';
import { Context } from 'alp-types';
import htmlLayout, { LayoutOptions } from './layout/htmlLayout';
import createAlpAppWrapper from './createAlpAppWrapper';

export { Helmet };

export { default as AlpModule } from './module/AlpModule';
export { default as SuspenseWrapper } from './module/SuspenseWrapper';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
export {
  default as LoadingFallbackContext,
} from './contexts/LoadingFallbackContext';

// const logger = new Logger( 'alp:react');

const renderHtml = (app: React.ReactElement<any>, options: LayoutOptions) => {
  const content = renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

const isModernBrowser = createIsModernBrowser();

interface Options {
  polyfillFeatures?: string;
  scriptName?: string | false;
  styleName?: string | false;
}

export type ReactAppCallback = (ctx: Context) => Promise<void>;

export default (
  App: React.ReactType<any>,
  options: Options = {},
): ReactAppCallback => async (ctx: Context) => {
  const version: string = ctx.config.get('version');
  // TODO create alp-useragent with getter in context
  const ua = ctx.req.headers['user-agent'];
  const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

  const app = React.createElement(App);
  const WrappedApp = createAlpAppWrapper(app, ctx);

  ctx.body = await renderHtml(React.createElement(WrappedApp), {
    version,
    scriptName: options.scriptName !== undefined ? options.scriptName : name,
    styleName: options.styleName !== undefined ? options.styleName : name,
    polyfillFeatures: options.polyfillFeatures,
    initialData: {
      sanitizedState: ctx.sanitizedState,
    },
  });
};
