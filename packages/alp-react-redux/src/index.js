import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger/src';
import createIsModernBrowser from 'modern-browsers';
import htmlLayout from './layout/htmlLayout';
import createAlpAppWrapper from './createAlpAppWrapper';
import createServerStore from './store/createServerStore';
import createModuleVisitor from './module/createModuleVisitor';
import type { ReduxActionType } from './types';

export { Helmet };
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export * from './types';
export {
  createAction,
  createReducer,
  createLoader,
  classNames,
  createPureStatelessComponent,
  identityReducer,
} from './utils/index';
export AlpModule from './module/AlpModule';
export AlpReduxModule from './module/AlpReduxModuleServer';
export Body from './layout/Body';
export AppContainer from './layout/AppContainer';

const logger = new Logger('alp:react-redux');

const renderHtml = (app, options) => {
  const content = renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

const isModernBrowser = createIsModernBrowser();

type OptionsType = {|
  polyfillFeatures?: ?string,
  scriptName?: ?string | false,
  sharedReducers?: ?{ [string]: any },
  styleName?: ?string | false,
|};

export default () => app => {
  app.reduxReducers = {};
  app.reduxMiddlewares = [];

  return {
    middleware: (ctx, next) => {
      ctx.reduxInitialContext = {};
      return next();
    },

    createApp: (App, options: ?OptionsType = {}) => async ctx => {
      const version: string = ctx.config.get('version');
      // TODO create alp-useragent with getter in context
      const ua = ctx.req.headers['user-agent'];
      const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

      const app = React.createElement(App);
      const moduleVisitor = createModuleVisitor();
      const preRenderStore = { getState: () => ({ ctx }) };
      const PreRenderWrappedApp = createAlpAppWrapper(app, { context: ctx, store: preRenderStore });
      await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

      const store = createServerStore(ctx, moduleVisitor.getReducers(), {
        sharedReducers: options.sharedReducers,
      });

      const WrappedApp = createAlpAppWrapper(app, { context: ctx, store });

      // eslint-disable-next-line no-unused-vars
      const { ctx: removeCtxFromInitialData, ...initialData } = store.getState();
      ctx.body = await renderHtml(React.createElement(WrappedApp), {
        version,
        scriptName: options.scriptName !== undefined ? options.scriptName : name,
        styleName: options.styleName !== undefined ? options.styleName : name,
        polyfillFeatures: options.polyfillFeatures,
        initialData,
      });
    },
  };
};

const loggerWebsocket = logger.child('websocket');

export function emitAction(to: string, action: ReduxActionType) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
