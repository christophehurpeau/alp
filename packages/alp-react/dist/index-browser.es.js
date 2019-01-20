import contentLoaded from 'content-loaded';
import React__default, { Component, createElement } from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
import ReactAlpContext, { AppStateContext } from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

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
      this.setState({
        error: error
      });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, {
        extra: errorInfo
      });
    };

    _proto.updateSanitizedState = function updateSanitizedState(patchState) {
      this.setState(function (prevState) {
        return {
          appState: _extends({}, prevState.appState, {
            patchState: patchState
          })
        };
      });
    };

    _proto.render = function render() {
      if (this.state.error) return React__default.createElement("div", null, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context
      }, React__default.createElement(AppStateContext.Provider, {
        value: this.state.appState
      }, app));
    };

    return AlpAppWrapper;
  }(Component), _temp;
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
}(Component);

var Body = (function (_ref) {
  var children = _ref.children;
  return React__default.createElement("div", null, children);
});

var AppContainer = (function (_ref) {
  var children = _ref.children;
  return createElement("div", null, children);
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
                hydrate(appElement, document.getElementById('react-app'));
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

export default browser;
export { AlpModule, Body, AppContainer };
//# sourceMappingURL=index-browser.es.js.map
