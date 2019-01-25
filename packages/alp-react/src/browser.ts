import contentLoaded from 'content-loaded';
import React from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserApplication } from 'alp-types';
import createAlpAppWrapper from './createAlpAppWrapper';

export { default as Helmet } from 'react-helmet';
export { default as AlpModule } from './module/AlpModule';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';

const logger = new Logger('alp:react');

declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}

export default (app: BrowserApplication) =>
  // loading: (state: number = 0, action: ReduxActionType) => {
  //   if (action.meta && action.meta.loading !== undefined) {
  //     return state + (action.meta.loading ? 1 : -1);
  //   }
  //   return state;
  // },
  async function renderApp(App: React.ReactType<{}>) {
    const initialData = window.__INITIAL_DATA__ || {};
    const ctx = app.createContext();
    if (initialData.sanitizedState) {
      ctx.sanitizedState = initialData.sanitizedState;
    }

    logger.success('render called');
    const WrappedApp = createAlpAppWrapper(React.createElement(App), ctx);
    const appElement = React.createElement(WrappedApp);

    await contentLoaded();
    // const container =
    hydrate(appElement, document.getElementById('react-app'));
    logger.success('rendered');

    // container.updateSanitizedState({ loading: false });
  };
