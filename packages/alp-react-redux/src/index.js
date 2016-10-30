import render from 'fody/src';
import Logger from 'nightingale-logger/src';
import { createStore } from 'redux/src';
import AlpHelmetHtml from './AlpHelmetHtml';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';

export { AlpHelmetHtml, AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody';
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export createPureStatelessComponent from 'react-pure-stateless-component';
export createAction from './createAction';
export createReducer from './createReducer';
export createLoader from './createLoader';
export Script from './helmet/Script';
export Stylesheet from './helmet/Stylesheet';

if (BROWSER) throw new Error('Not supposed to be loaded browser-side.');

const logger = new Logger('alp:react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [
  { name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 },
  { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 },
  { name: 'Chrome', regexp: /chrom(?:e|ium)\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
  { name: 'Safari', regexp: /version\/([\d\w.-]+).*safari/i, modernMinVersion: 10 },
];

export default function alpReactRedux(Html = AlpHelmetHtml) {
  return (app: Object) => {
    app.context.render = function (moduleDescriptor, data, _loaded) {
      logger.debug('render view', { data });

      if (!_loaded && moduleDescriptor.loader) {
        // const _state = data;
        return moduleDescriptor.loader(Object.create(null), data).then(data => (
          this.render(moduleDescriptor, data, true)
        ));
      }

      if (moduleDescriptor.reducer) {
        this.store = createStore(moduleDescriptor.reducer, data);
      }


      this.body = render({
        Html,
        App: moduleDescriptor.reducer ? AlpReduxApp : AlpReactApp,
        appProps: {
          store: this.store,
          context: this,
          moduleDescriptor,
          get scriptName() {
            // TODO create alp-useragent with getter in context
            const ua = this.context.req.headers['user-agent'];

            if (agents.some(agent => {
              const res = agent.regexp.exec(ua);
              return res && res[1] >= agent.modernMinVersion;
            })) {
              return 'modern-browsers';
            }

            return 'es5';
          },
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleDescriptor.reducer ? this.store.getState() : null,
        },
        View: moduleDescriptor.View,
        props: moduleDescriptor.reducer ? undefined : data,
      });
    };
  };
}

export function emitAction(to, action) {
  to.emit('redux:action', action);
}
