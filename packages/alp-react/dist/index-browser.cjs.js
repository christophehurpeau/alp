'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/esm/asyncToGenerator'));
var contentLoaded = _interopDefault(require('content-loaded'));
var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');
var Logger = _interopDefault(require('nightingale-logger'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/esm/inheritsLoose'));
var ReactAlpContext = _interopDefault(require('react-alp-context'));
var reactHelmet = _interopDefault(require('react-helmet'));

var createAlpAppWrapper = (function (app, context) {
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
      if (window.Raven) window.Raven.captureException(error, {
        extra: errorInfo
      });
    };

    _proto.render = function render() {
      if (this.state.error) return React__default.createElement("div", null, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context
      }, app);
    };

    return AlpAppWrapper;
  }(React.Component), _temp;
});

var LoadingFallbackContext = React.createContext('Loading...');

function AlpModuleBrowser(props) {
  var loadingFallback = React.useContext(LoadingFallbackContext);
  return React__default.createElement(React.Suspense, {
    fallback: loadingFallback
  }, props.children);
}

function BrowserSuspenseWrapper(_ref2) {
  var children = _ref2.children;
  var loader = React.useContext(LoadingFallbackContext);
  return React__default.createElement(React.Suspense, {
    fallback: loader
  }, children);
}

var Body = (function (_ref) {
  var children = _ref.children;
  return React__default.createElement("div", null, children);
});

var AppContainer = (function (_ref) {
  var children = _ref.children;
  return React.createElement(React.Fragment, null, children);
});

var logger = new Logger('alp:react');
var browser = (function (app // loading: (state: number = 0, action: ReduxActionType) => {
//   if (action.meta && action.meta.loading !== undefined) {
//     return state + (action.meta.loading ? 1 : -1);
//   }
//   return state;
// },
) {
  return (
    /*#__PURE__*/
    function () {
      var _renderApp = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(App) {
        var initialData, ctx, WrappedApp, appElement;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                initialData = window.__INITIAL_DATA__ || {};
                ctx = app.createContext();

                if (initialData.sanitizedState) {
                  ctx.sanitizedState = initialData.sanitizedState;
                }

                logger.success('render called');
                WrappedApp = createAlpAppWrapper(React__default.createElement(App), ctx);
                appElement = React__default.createElement(WrappedApp);
                _context.next = 8;
                return contentLoaded();

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
    }()
  );
});

exports.Helmet = reactHelmet;
exports.AlpModule = AlpModuleBrowser;
exports.AppContainer = AppContainer;
exports.Body = Body;
exports.LoadingFallbackContext = LoadingFallbackContext;
exports.SuspenseWrapper = BrowserSuspenseWrapper;
exports.default = browser;
//# sourceMappingURL=index-browser.cjs.js.map
