'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _regeneratorRuntime = require('@babel/runtime/regenerator');
var _asyncToGenerator = require('@babel/runtime/helpers/esm/asyncToGenerator');
var contentLoaded = require('content-loaded');
var Logger = require('nightingale-logger');
var React = require('react');
var reactDom = require('react-dom');
var ReactAlpContext = require('react-alp-context');
var reactHelmet = require('react-helmet');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var contentLoaded__default = /*#__PURE__*/_interopDefaultLegacy(contentLoaded);
var Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);
var reactHelmet__default = /*#__PURE__*/_interopDefaultLegacy(reactHelmet);

function createAlpAppWrapper(app, context) {
  var _temp;

  return _temp = class AlpAppWrapper extends React.Component {
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
      if (this.state.error) return /*#__PURE__*/React__default.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React__default.createElement(ReactAlpContext__default.Provider, {
        value: context
      }, app);
    }

  }, _temp;
}

var LoadingFallbackContext = /*#__PURE__*/React.createContext('Loading...');

function AlpModuleBrowser(props) {
  const loadingFallback = React.useContext(LoadingFallbackContext);
  return /*#__PURE__*/React__default.createElement(React.Suspense, {
    fallback: loadingFallback
  }, props.children);
}

function BrowserSuspenseWrapper({
  children
}) {
  const loader = React.useContext(LoadingFallbackContext);
  return /*#__PURE__*/React__default.createElement(React.Suspense, {
    fallback: loader
  }, children);
}

function Body({
  children
}) {
  return /*#__PURE__*/React__default.createElement("div", null, children);
}

function AppContainer({
  children
}) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, children);
}

const logger = new Logger__default('alp:react');
function alpReactBrowser(app) {
  return /*#__PURE__*/function () {
    var _renderApp = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(App) {
      var initialData, ctx, WrappedApp, appElement;
      return _regeneratorRuntime__default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            initialData = window.__INITIAL_DATA__ || {};
            ctx = app.createContext();

            if (initialData.sanitizedState) {
              ctx.sanitizedState = initialData.sanitizedState;
            }

            logger.success('render called');
            WrappedApp = createAlpAppWrapper( /*#__PURE__*/React__default.createElement(App), ctx);
            appElement = /*#__PURE__*/React__default.createElement(WrappedApp);
            _context.next = 8;
            return contentLoaded__default();

          case 8:
            // const container =
            reactDom.hydrate(appElement, document.getElementById('react-app'));
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

exports.Helmet = reactHelmet__default;
exports.AlpModule = AlpModuleBrowser;
exports.AppContainer = AppContainer;
exports.Body = Body;
exports.LoadingFallbackContext = LoadingFallbackContext;
exports.SuspenseWrapper = BrowserSuspenseWrapper;
exports.default = alpReactBrowser;
//# sourceMappingURL=index-browser-dev.cjs.js.map
