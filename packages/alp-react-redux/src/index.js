import render from 'fody/src';
import Logger from 'nightingale-logger/src';
import isModernBrowser from 'modern-browsers';
import { createStore, combineReducers } from 'redux/src';
import AlpLayout from './layout/AlpLayout';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';
import * as alpReducers from './reducers';
import type { ModuleDescriptorType } from './types';

export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody/src';
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export createPureStatelessComponent from 'react-pure-stateless-component';
export { createAction, createReducer, createLoader, classNames } from './utils';
export { AlpHtml, AlpLayout, AlpHead, AlpBody } from './layout';

if (BROWSER) throw new Error('Not supposed to be loaded browser-side.');

const logger = new Logger('alp:react-redux');

type OptionsType = {|
  Layout: ?any,
  sharedReducers: ?Object,
|};

export default function alpReactRedux(
  { Layout = AlpLayout, sharedReducers = {} }: OptionsType = {}
) {
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
      this.body = render({
        Layout,
        layoutProps: {
          version,
          moduleIdentifier,
          scriptName: name,
          styleName: name,
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleHasReducers ? initialData : null,
        },

        App: reducer ? AlpReduxApp : AlpReactApp,
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
