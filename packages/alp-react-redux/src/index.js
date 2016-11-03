import render from 'fody/src';
import Logger from 'nightingale-logger/src';
import { createStore } from 'redux/src';
import AlpLayout from './layout/AlpLayout';
import AlpReactApp from './AlpReactApp';
import AlpReduxApp from './AlpReduxApp';
import type { ModuleDescriptorType } from './types';

export { AlpReactApp, AlpReduxApp };
export { Helmet } from 'fody/src';
export { combineReducers } from 'redux/src';
export { connect } from 'react-redux/src';
export createPureStatelessComponent from 'react-pure-stateless-component';
export { createAction, createReducer, createLoader } from './utils';
export { AlpHtml, AlpLayout, AlpHead, AlpBody } from './layout';

if (BROWSER) throw new Error('Not supposed to be loaded browser-side.');

const logger = new Logger('alp:react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
const agents = [
  { name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 14 },
  { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 47 },
  { name: 'Chrome', regexp: /chrom(?:e|ium)\/([\d]+)/i, modernMinVersion: 51 }, // also works for opera.
  { name: 'Safari', regexp: /version\/([\d\w.-]+).*safari/i, modernMinVersion: 10 },
];

export default function alpReactRedux(Layout = AlpLayout) {
  return (app: Object) => {
    app.context.render = function (moduleDescriptor: ModuleDescriptorType, data: ?Object, _loaded) {
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

      const version: string = this.config.get('version');
      const moduleIdentifier: ?string = moduleDescriptor && moduleDescriptor.identifier;


      this.body = render({
        Layout,
        layoutProps: {
          version,
          moduleIdentifier,
          scriptName: (() => {
            // TODO create alp-useragent with getter in context
            const ua = this.req.headers['user-agent'];

            if (agents.some(agent => {
              const res = agent.regexp.exec(ua);
              return res && res[1] >= agent.modernMinVersion;
            })) {
              return 'modern-browsers';
            }

            return 'es5';
          })(),
          initialBrowserContext: this.computeInitialContextForBrowser(),
          initialData: moduleDescriptor.reducer ? this.store.getState() : null,
        },

        App: moduleDescriptor.reducer ? AlpReduxApp : AlpReactApp,
        appProps: {
          store: this.store,
          context: this,
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
