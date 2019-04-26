import contentLoaded from 'content-loaded';
import React__default, { Component, createContext, useContext, Suspense, createElement, Fragment } from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
import ReactAlpContext from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

const createAlpAppWrapper = (function (app, context) {
  var _temp;

  return _temp = class AlpAppWrapper extends Component {
    constructor(...args) {
      super(...args);
      this.state = {
        error: null,
        appState: context.sanitizedState
      };
    }

    componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, {
        extra: errorInfo
      });
    }

    render() {
      if (this.state.error) return React__default.createElement("div", null, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context
      }, app);
    }

  }, _temp;
});

const LoadingFallbackContext = createContext('Loading...');

function AlpModuleBrowser(props) {
  const loadingFallback = useContext(LoadingFallbackContext);
  return React__default.createElement(Suspense, {
    fallback: loadingFallback
  }, props.children);
}

function BrowserSuspenseWrapper({
  children
}) {
  const loader = useContext(LoadingFallbackContext);
  return React__default.createElement(Suspense, {
    fallback: loader
  }, children);
}

const Body = (function ({
  children
}) {
  return React__default.createElement("div", null, children);
});

const AppContainer = (function ({
  children
}) {
  return createElement(Fragment, null, children);
});

const logger = new Logger('alp:react');
const browser = (function (app // loading: (state: number = 0, action: ReduxActionType) => {
//   if (action.meta && action.meta.loading !== undefined) {
//     return state + (action.meta.loading ? 1 : -1);
//   }
//   return state;
// },
) {
  return async function renderApp(App) {
    const initialData = window.__INITIAL_DATA__ || {};
    const ctx = app.createContext();

    if (initialData.sanitizedState) {
      ctx.sanitizedState = initialData.sanitizedState;
    }

    logger.success('render called');
    const WrappedApp = createAlpAppWrapper(React__default.createElement(App), ctx);
    const appElement = React__default.createElement(WrappedApp);
    await contentLoaded(); // const container =

    hydrate(appElement, document.getElementById('react-app'));
    logger.success('rendered'); // container.updateSanitizedState({ loading: false });
  };
});

export default browser;
export { AlpModuleBrowser as AlpModule, AppContainer, Body, LoadingFallbackContext, BrowserSuspenseWrapper as SuspenseWrapper };
//# sourceMappingURL=index-browsermodern.es.js.map
