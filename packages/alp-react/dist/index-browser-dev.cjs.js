'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var contentLoaded = _interopDefault(require('content-loaded'));
var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');
var Logger = _interopDefault(require('nightingale-logger'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/esm/inheritsLoose'));
var ReactAlpContext = _interopDefault(require('react-alp-context'));
var reactHelmet = _interopDefault(require('react-helmet'));

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
function createAlpAppWrapper(app, context) {
  var _temp;

  return _temp =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      var _this, _len, args, _key;

      for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.state = {
        error: null,
        appState: context.sanitizedState
      };
      return _this;
    }

    var _proto = AlpAppWrapper.prototype;

    _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);

      if (window.Raven) {
        window.Raven.captureException(error, {
          extra: errorInfo
        });
      }
    };

    _proto.render = function render() {
      if (this.state.error) return React__default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        },
        __self: this
      }, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 35
        },
        __self: this
      }, app);
    };

    return AlpAppWrapper;
  }(React.Component), _temp;
}

var LoadingFallbackContext = React.createContext('Loading...');

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/alp-react/src/module/AlpModule.tsx";

function AlpModuleBrowser(props) {
  var loadingFallback = React.useContext(LoadingFallbackContext);
  return React__default.createElement(React.Suspense, {
    fallback: loadingFallback,
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 15
    },
    __self: this
  }, props.children);
}

var _jsxFileName$2 = "/Users/chris/Work/alp/alp/packages/alp-react/src/module/SuspenseWrapper.tsx";

function BrowserSuspenseWrapper(_ref2) {
  var children = _ref2.children;
  var loader = React.useContext(LoadingFallbackContext);
  return React__default.createElement(React.Suspense, {
    fallback: loader,
    __source: {
      fileName: _jsxFileName$2,
      lineNumber: 15
    },
    __self: this
  }, children);
}

var _jsxFileName$3 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/Body.tsx";
function Body(_ref) {
  var children = _ref.children;
  return React__default.createElement("div", {
    __source: {
      fileName: _jsxFileName$3,
      lineNumber: 8
    },
    __self: this
  }, children);
}

function AppContainer(_ref) {
  var children = _ref.children;
  return React__default.createElement(React__default.Fragment, null, children);
}

var logger = new Logger('alp:react');
function alpReactBrowser(app) {
  return function renderApp(App) {
    var initialData, ctx, WrappedApp, appElement;
    return _regeneratorRuntime.async(function renderApp$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // eslint-disable-next-line no-underscore-dangle
            initialData = window.__INITIAL_DATA__ || {};
            ctx = app.createContext();

            if (initialData.sanitizedState) {
              ctx.sanitizedState = initialData.sanitizedState;
            }

            logger.success('render called');
            WrappedApp = createAlpAppWrapper(React__default.createElement(App), ctx);
            appElement = React__default.createElement(WrappedApp);
            _context.next = 8;
            return _regeneratorRuntime.awrap(contentLoaded());

          case 8:
            // const container =
            reactDom.hydrate(appElement, document.getElementById('react-app'));
            logger.success('rendered'); // container.updateSanitizedState({ loading: false });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  };
}

exports.Helmet = reactHelmet;
exports.AlpModule = AlpModuleBrowser;
exports.AppContainer = AppContainer;
exports.Body = Body;
exports.LoadingFallbackContext = LoadingFallbackContext;
exports.SuspenseWrapper = BrowserSuspenseWrapper;
exports.default = alpReactBrowser;
//# sourceMappingURL=index-browser-dev.cjs.js.map
