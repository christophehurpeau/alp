'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var contentLoaded = _interopDefault(require('content-loaded'));
var React = require('react');
var React__default = _interopDefault(React);
var reactDom = require('react-dom');
var Logger = _interopDefault(require('nightingale-logger'));
var ReactAlpContext = _interopDefault(require('react-alp-context'));
var reactHelmet = _interopDefault(require('react-helmet'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
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
      if (this.state.error) return React__default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        },
        __self: this
      }, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        },
        __self: this
      }, app);
    };

    return AlpAppWrapper;
  }(React.Component), _temp;
});

var AlpModule =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(AlpModule, _Component);

  function AlpModule() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AlpModule.prototype;

  _proto.render = function render() {
    return this.props.children;
  };

  return AlpModule;
}(React.Component);

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/Body.tsx";
var Body = (function (_ref) {
  var children = _ref.children;
  return React__default.createElement("div", {
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 8
    },
    __self: this
  }, children);
});

var _jsxFileName$2 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/AppContainer.tsx";
var AppContainer = (function (_ref) {
  var children = _ref.children;
  return React.createElement("div", {
    __source: {
      fileName: _jsxFileName$2,
      lineNumber: 7
    },
    __self: this
  }, children);
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
      regeneratorRuntime.mark(function _callee(App) {
        var initialData, ctx, WrappedApp, appElement;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
        }, _callee, this);
      }));

      return function renderApp() {
        return _renderApp.apply(this, arguments);
      };
    }()
  );
});

exports.Helmet = reactHelmet;
exports.default = browser;
exports.AlpModule = AlpModule;
exports.Body = Body;
exports.AppContainer = AppContainer;
//# sourceMappingURL=index-browser-dev.cjs.js.map
