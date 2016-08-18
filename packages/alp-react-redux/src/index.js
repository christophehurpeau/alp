import render, { App as DefaultApp } from 'fody';
import ReduxApp from 'fody-redux-app';
import Logger from 'nightingale-logger';
import { createStore } from 'redux';

export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export createPureStatelessComponent from 'react-pure-stateless-component';
export createAction from './createAction';
export createReducer from './createReducer';
export createLoader from './createLoader';

const logger = new Logger('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [
  { name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 },
  { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 },
  { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
  { name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 38 },
  { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 },
];

export default function alpReactRedux(Html) {
  return (app: Object) => {
    app.context.render = function (moduleDescriptor, data, _loaded) {
      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(undefined, data).then(data => (
          this.render(moduleDescriptor, data, true)
        ));
      }

      if (moduleDescriptor.reducer) {
        this.store = createStore(moduleDescriptor.reducer, data);
      }

      this.body = render({
        htmlData: {
          context: this,
          moduleDescriptor,
          get scriptName() {
            // TODO create alp-useragent with getter in context
            const ua = this.context.req.headers['user-agent'];

            for (let agent of agents) {
              const res = agent.regexp.exec(ua);
              if (res && res[1] >= agent.modernMinVersion) {
                return 'modern-browsers';
              }
            }
            return 'es5';
          },
          initialBrowserContext: this.computeInitialContextForBrowser(),
        },
        context: this,
        View: moduleDescriptor.View,
        data: moduleDescriptor.reducer ? undefined : data,
        initialData: moduleDescriptor.reducer ? () => this.store.getState() : () => null,
        Html,
        App: moduleDescriptor.reducer ? ReduxApp : DefaultApp,
      });
    };
  };
}

export function emitAction(to, action) {
  to.emit('redux:action', action);
}
