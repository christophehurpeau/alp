import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import Logger from 'nightingale-logger/src';
import isModernBrowser from 'modern-browsers';
import { createStore, combineReducers } from 'redux/src';
import htmlLayout, { type LayoutOptionsType } from './layout/htmlLayout';
import AlpReactApp from './old/layout/AlpReactApp';
import AlpReduxApp from './old/layout/AlpReduxApp';
import * as alpReducers from './reducers/index';
import type { ReactComponentType, ModuleDescriptorType } from '../types';

export { AlpReactApp, AlpReduxApp, Helmet };
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent } from '../utils/index';

if (BROWSER) throw new Error('Not supposed to be loaded browser-side.');

const logger = new Logger('alp:react-redux');

const renderToStringApp = (App, appProps, View, props): string => {
  const app = <App {...appProps}><View {...props} /></App>;
  return renderToString(app);
};

type AppOptionsType = {|
  App: ReactComponentType,
  appProps: Object,
  View: ReactComponentType,
  props: ?Object,
  layoutOptions: ?LayoutOptionsType,
|};

const renderHtml = ({ App, appProps, View, props, layoutOptions }: AppOptionsType) => {
  const content = renderToStringApp(App, appProps, View, props);
  const helmet = Helmet.renderStatic();
  return `<!doctype html>\n${htmlLayout(helmet, content, layoutOptions)}`;
};


type OptionsType = {|
  layoutBody: ?Function,
  appHOC: ?Function,
  sharedReducers: ?Object,
|};

export default function alpReactRedux(
  { layoutBody, appHOC, sharedReducers = {} }: OptionsType = {}
) {
  const AlpReactAppLayout = appHOC ? appHOC(AlpReactApp) : AlpReactApp;
  const AlpReduxAppLayout = appHOC ? appHOC(AlpReduxApp) : AlpReduxApp;

  return (app: Object) => {
    app.context.render = function (moduleDescriptor: ModuleDescriptorType, data: ?Object, _loaded) {
      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(data => (
          this.render(moduleDescriptor, data, true)
        ));
      }

      const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      const reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : (
          combineReducers({ ...moduleDescriptor.reducers, ...alpReducers, ...sharedReducers })
        );

      if (reducer) {
        this.store = createStore(reducer, { context: this, ...data });
      }

      const version: string = this.config.get('version');
      const moduleIdentifier: ?string = moduleDescriptor && moduleDescriptor.identifier;

      // eslint-disable-next-line no-unused-vars
      const { context: unusedContext, ...initialData } =
        moduleHasReducers ? this.store.getState() : {};

      // TODO create alp-useragent with getter in context
      const ua = this.req.headers['user-agent'];
      const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

      this.body = renderHtml({
        layoutOptions: {
          layoutBody,
          version,
          moduleIdentifier,
          scriptName: name,
          styleName: name,
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleHasReducers ? initialData : null,
        },

        App: reducer ? AlpReduxAppLayout : AlpReactAppLayout,
        appProps: {
          store: this.store,
          context: this,
        },

        View: moduleDescriptor.View,
        props: moduleHasReducers ? undefined : data,
      });
    };
  };
}

const loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
