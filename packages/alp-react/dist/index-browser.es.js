import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import contentLoaded from 'content-loaded';
import Logger from 'nightingale-logger';
import React, { Component, createContext, useContext, Suspense } from 'react';
import { hydrate } from 'react-dom';
import ReactAlpContext from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

function createAlpAppWrapper(app, context) {
  var _temp;

  return _temp = class AlpAppWrapper extends Component {
    constructor(...args) {
      super(...args);
      this.state = {
        error: null
      };
    }

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
      if (this.state.error) return /*#__PURE__*/React.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React.createElement(ReactAlpContext.Provider, {
        value: context
      }, app);
    }

  }, _temp;
}

var LoadingFallbackContext = /*#__PURE__*/createContext('Loading...');

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
  return /*#__PURE__*/function () {
    var _renderApp = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(App) {
      var initialData, ctx, WrappedApp, appElement;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            initialData = window.__INITIAL_DATA__ || {};
            ctx = app.createContext();

            if (initialData.sanitizedState) {
              ctx.sanitizedState = initialData.sanitizedState;
            }

            logger.success('render called');
            WrappedApp = createAlpAppWrapper( /*#__PURE__*/React.createElement(App), ctx);
            appElement = /*#__PURE__*/React.createElement(WrappedApp);
            _context.next = 8;
            return contentLoaded();

          case 8:
            // const container =
            hydrate(appElement, document.getElementById('react-app'));
            logger.success('rendered'); // container.updateSanitizedState({ loading: false });

          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));

    return function renderApp() {
      return _renderApp.apply(this, arguments);
    };
  }();
}

export default alpReactBrowser;
export { AlpModuleBrowser as AlpModule, AppContainer, Body, LoadingFallbackContext, BrowserSuspenseWrapper as SuspenseWrapper };
//# sourceMappingURL=index-browser.es.js.map
