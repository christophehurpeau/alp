import contentLoaded from 'content-loaded';
import React, { Component, createContext, useContext, Suspense } from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
import ReactAlpContext from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

function createAlpAppWrapper(app, context) {
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

      if (window.Raven) {
        window.Raven.captureException(error, {
          extra: errorInfo
        });
      }
    }

    render() {
      if (this.state.error) return /*#__PURE__*/React.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React.createElement(ReactAlpContext.Provider, {
        value: context
      }, app);
    }

  }, _temp;
}

const LoadingFallbackContext = createContext('Loading...');

function AlpModuleBrowser(props) {
  const loadingFallback = useContext(LoadingFallbackContext);
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: loadingFallback
  }, props.children);
}

function BrowserSuspenseWrapper({
  children
}) {
  const loader = useContext(LoadingFallbackContext);
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: loader
  }, children);
}

function Body({
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, children);
}

function AppContainer({
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
}

const logger = new Logger('alp:react');
function alpReactBrowser(app) {
  return async function renderApp(App) {
    // eslint-disable-next-line no-underscore-dangle
    const initialData = window.__INITIAL_DATA__ || {};
    const ctx = app.createContext();

    if (initialData.sanitizedState) {
      ctx.sanitizedState = initialData.sanitizedState;
    }

    logger.success('render called');
    const WrappedApp = createAlpAppWrapper(React.createElement(App), ctx);
    const appElement = React.createElement(WrappedApp);
    await contentLoaded(); // const container =

    hydrate(appElement, document.getElementById('react-app'));
    logger.success('rendered'); // container.updateSanitizedState({ loading: false });
  };
}

export default alpReactBrowser;
export { AlpModuleBrowser as AlpModule, AppContainer, Body, LoadingFallbackContext, BrowserSuspenseWrapper as SuspenseWrapper };
//# sourceMappingURL=index-browsermodern.es.js.map
