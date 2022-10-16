import contentLoaded from 'content-loaded';
import { Logger } from 'nightingale-logger';
import React, { Component, createContext, useContext, Suspense } from 'react';
import { hydrate } from 'react-dom';
import ReactAlpContext from 'react-alp-context';
import { jsx } from 'react/jsx-runtime';
export { default as Helmet } from 'react-helmet';

function createAlpAppWrapper(app, context) {
  return class AlpAppWrapper extends Component {
    state = {
      error: null
    };
    componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack
            }
          }
        });
      }
    }
    render() {
      if (this.state.error) return /*#__PURE__*/jsx("div", {
        children: "An unexpected error occured"
      });
      return /*#__PURE__*/jsx(ReactAlpContext.Provider, {
        value: context,
        children: app
      });
    }
  };
}

const LoadingFallbackContext = /*#__PURE__*/createContext('Loading...');

function AlpModuleBrowser(props) {
  const loadingFallback = useContext(LoadingFallbackContext);
  return /*#__PURE__*/jsx(Suspense, {
    fallback: loadingFallback,
    children: props.children
  });
}

function BrowserSuspenseWrapper({
  children
}) {
  const loader = useContext(LoadingFallbackContext);
  return /*#__PURE__*/jsx(Suspense, {
    fallback: loader,
    children: children
  });
}

function Body({
  children
}) {
  return /*#__PURE__*/jsx("div", {
    children: children
  });
}

function AppContainer({
  children
}) {
  return children;
}

const logger = new Logger('alp:react');
function alpReactBrowser(app) {
  return async function renderApp(App) {
    const initialData = window.__INITIAL_DATA__ || {};
    const ctx = app.createContext();
    if (initialData.sanitizedState) {
      ctx.sanitizedState = initialData.sanitizedState;
    }
    logger.success('render called');
    const WrappedApp = createAlpAppWrapper( /*#__PURE__*/React.createElement(App), ctx);
    const appElement = /*#__PURE__*/React.createElement(WrappedApp);
    await contentLoaded();
    // const container =
    hydrate(appElement, document.getElementById('react-app'));
    logger.success('rendered');

    // container.updateSanitizedState({ loading: false });
  };
}

export { AlpModuleBrowser as AlpModule, AppContainer, Body, LoadingFallbackContext, BrowserSuspenseWrapper as SuspenseWrapper, alpReactBrowser as default };
//# sourceMappingURL=index-browsermodern.es.js.map
