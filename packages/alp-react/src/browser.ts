import type { BrowserApplication, ContextSanitizedState } from 'alp-types';
import contentLoaded from 'content-loaded';
import { Logger } from 'nightingale-logger';
import type { ElementType } from 'react';
import React from 'react';
import { hydrate } from 'react-dom';
import createAlpAppWrapper from './createAlpAppWrapper';

export { default as Helmet } from 'react-helmet';
export { default as AlpModule } from './module/AlpModule';
export { default as SuspenseWrapper } from './module/SuspenseWrapper';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
export { default as LoadingFallbackContext } from './contexts/LoadingFallbackContext';

const logger = new Logger('alp:react');

declare global {
  interface Window {
    __INITIAL_DATA__?: {
      sanitizedState?: ContextSanitizedState;
    };
  }
}

export default function alpReactBrowser(app: BrowserApplication) {
  return async function renderApp(
    App: ElementType<Record<string, never>>,
  ): Promise<void> {
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
}
