var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import render from 'fody';
import Logger from 'nightingale-logger';
import isModernBrowser from 'modern-browsers';
import { createStore, combineReducers } from 'redux';
import AlpLayout from './layout/AlpLayout';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';
import * as alpReducers from './reducers';


export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody';
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
import _createPureStatelessComponent from 'react-pure-stateless-component';
export { _createPureStatelessComponent as createPureStatelessComponent };

export { createAction, createReducer, createLoader, classNames } from './utils';
export { AlpHtml, AlpLayout, AlpHead, AlpBody } from './layout';

throw new Error('Not supposed to be loaded browser-side.');

const logger = new Logger('alp:react-redux');

export default function alpReactRedux({ Layout = AlpLayout, sharedReducers = {} } = {}) {
  return function (app) {
    app.context.render = function (moduleDescriptor, data, _loaded) {
      var _this = this;

      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(function (data) {
          return _this.render(moduleDescriptor, data, true);
        });
      }

      const moduleHasReducers = !!(moduleDescriptor.reducer || moduleDescriptor.reducers);
      const reducer = moduleDescriptor.reducer ? moduleDescriptor.reducer : combineReducers(_extends({}, moduleDescriptor.reducers, alpReducers, sharedReducers));

      if (reducer) {
        this.store = createStore(reducer, _extends({ context: this }, data));
      }

      const version = this.config.get('version');
      const moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;

      // eslint-disable-next-line no-unused-vars
      const _ref = moduleHasReducers ? this.store.getState() : {},
            { context: unusedContext } = _ref,
            initialData = _objectWithoutProperties(_ref, ['context']);

      this.body = render({
        Layout,
        layoutProps: {
          version,
          moduleIdentifier,
          scriptName: function () {
            // TODO create alp-useragent with getter in context
            const ua = _this.req.headers['user-agent'];
            return isModernBrowser(ua) ? 'modern-browsers' : 'es5';
          }(),
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleHasReducers ? initialData : null
        },

        App: reducer ? AlpReduxApp : AlpReactApp,
        appProps: {
          store: this.store,
          context: this
        },

        View: moduleDescriptor.View,
        props: moduleHasReducers ? undefined : data
      });
    };
  };
}

const loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map