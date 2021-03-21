'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _regeneratorRuntime = require('@babel/runtime/regenerator');
var _asyncToGenerator = require('@babel/runtime/helpers/esm/asyncToGenerator');
var contentLoaded = require('content-loaded');
var Logger = require('nightingale-logger');
var React = require('react');
var reactDom = require('react-dom');
var _inheritsLoose = require('@babel/runtime/helpers/esm/inheritsLoose');
var ReactAlpContext = require('react-alp-context');
var reactHelmet = require('react-helmet');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var contentLoaded__default = /*#__PURE__*/_interopDefaultLegacy(contentLoaded);
var Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var _inheritsLoose__default = /*#__PURE__*/_interopDefaultLegacy(_inheritsLoose);
var ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);
var reactHelmet__default = /*#__PURE__*/_interopDefaultLegacy(reactHelmet);

function createAlpAppWrapper(app, context) {
  return /*#__PURE__*/function (_Component) {
    _inheritsLoose__default(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      var _this, _len, args, _key;

      for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.state = {
        error: null
      };
      return _this;
    }

    var _proto = AlpAppWrapper.prototype;

    _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
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
    };

    _proto.render = function render() {
      if (this.state.error) return /*#__PURE__*/React__default.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React__default.createElement(ReactAlpContext__default.Provider, {
        value: context
      }, app);
    };

    return AlpAppWrapper;
  }(React.Component);
}

var LoadingFallbackContext = /*#__PURE__*/React.createContext('Loading...');

function AlpModuleBrowser(props) {
  var loadingFallback = React.useContext(LoadingFallbackContext);
  return /*#__PURE__*/React__default.createElement(React.Suspense, {
    fallback: loadingFallback
  }, props.children);
}

function BrowserSuspenseWrapper(_ref2) {
  var children = _ref2.children;
  var loader = React.useContext(LoadingFallbackContext);
  return /*#__PURE__*/React__default.createElement(React.Suspense, {
    fallback: loader
  }, children);
}

function Body(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", null, children);
}

function AppContainer(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, children);
}

var logger = new Logger__default('alp:react');
function alpReactBrowser(app) {
  return /*#__PURE__*/function () {
    var _renderApp = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(App) {
      var initialData, ctx, WrappedApp, appElement;
      return _regeneratorRuntime__default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
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
//# sourceMappingURL=index-browser.cjs.js.map
