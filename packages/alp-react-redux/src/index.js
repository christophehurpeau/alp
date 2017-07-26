import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger/src';
import isModernBrowser from 'modern-browsers';
import htmlLayout from './layout/htmlLayout';
import createAlpAppWrapper from './createAlpAppWrapper';
import createServerStore from './store/createServerStore';
import createModuleStoreReducer from './store/createModuleStoreReducer';

export { Helmet };
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
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

const renderHtml = (App, options) => {
  const content = renderToString(React.createElement(App));
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

type OptionsType = {|
  sharedReducers: ?{ [string]: any },
  scriptName: ?string | false,
  styleName: ?string | false,
  polyfillFeatures: ?string,
|};

export default (App, options: ?OptionsType = {}) => ctx => {
  const version: string = ctx.config.get('version');
  // TODO create alp-useragent with getter in context
  const ua = ctx.req.headers['user-agent'];
  const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';
  ctx.urlGenerator = () => null;

  const moduleStoreReducer = createModuleStoreReducer();
  const store = createServerStore(ctx, moduleStoreReducer.reducer, {
    sharedReducers: options.sharedReducers,
  });

  const WrappedApp = createAlpAppWrapper(App, {
    context: ctx,
    app: ctx.app,
    store,
    setModuleReducers: reducers => moduleStoreReducer.set(store, reducers),
  });

  ctx.body = renderHtml(WrappedApp, {
    version,
    scriptName: options.scriptName !== undefined ? options.scriptName : name,
    styleName: options.styleName !== undefined ? options.styleName : name,
    polyfillFeatures: options.polyfillFeatures,
    initialData: store.getState(),
  });
};

const loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
