import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
export { combineReducers } from 'redux';
import { connect } from 'react-redux';
export { connect } from 'react-redux';
import contentLoaded from 'content-loaded';
import { hydrate } from 'react-dom';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import reactHelmet from 'react-helmet';
export { default as Helmet } from 'react-helmet';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
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
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var createAlpAppWrapper = (function (app, context) {
  var _class, _temp2;

  return _temp2 = _class = function (_Component) {
    inherits(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, AlpAppWrapper);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AlpAppWrapper.__proto__ || Object.getPrototypeOf(AlpAppWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        error: null
      }, _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(AlpAppWrapper, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return context;
      }
    }, {
      key: 'componentDidCatch',
      value: function componentDidCatch(error, errorInfo) {
        this.setState({ error: error });
        console.error(error, errorInfo);
        if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.state.error) return React.createElement(
          'div',
          null,
          'An unexpected error occured'
        );
        return app;
      }
    }]);
    return AlpAppWrapper;
  }(Component), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp2;
});

var identityReducer = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return state;
});

var promiseMiddleware = function promiseMiddleware(store) {
  return function (next) {
    return function (action) {
      if (typeof action.then !== 'function') {
        return next(action);
      }

      return Promise.resolve(action).then(store.dispatch);
    };
  };
};

var createFunctionMiddleware = function createFunctionMiddleware(app) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (typeof action !== 'function') {
          return next(action);
        }

        return action(store.dispatch, app);
      };
    };
  };
};

var createBrowserStore = (function (app, ctx, moduleReducer, _ref) {
  var middlewares = _ref.middlewares,
      sharedReducers = _ref.sharedReducers;

  var reducers = Object.assign({}, app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  });

  var rootReducer = combineReducers(reducers);

  var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware].concat(toConsumableArray(app.reduxMiddlewares), toConsumableArray(middlewares));

  return createStore(rootReducer, Object.assign({ ctx: ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware.apply(undefined, toConsumableArray(middlewares))));
});

var MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

var createModuleReducer = function createModuleReducer(reducers) {
  return reducers ? combineReducers(reducers) : function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return state;
  };
};

var createBrowserModuleStoreReducer = (function (initialReducers) {
  var _reducers = initialReducers;
  var moduleReducer = createModuleReducer(initialReducers);
  return {
    reducer: function reducer(state, action) {
      return moduleReducer(action.type === MODULE_INIT_TYPE ? undefined : state, action);
    },

    set: function set(store, reducers) {
      if (reducers === _reducers) return false;
      return new Promise(function (resolve) {
        setImmediate(function () {
          _reducers = reducers;
          moduleReducer = createModuleReducer(reducers);
          store.dispatch({ type: MODULE_INIT_TYPE });
          resolve();
        });
      });
    }
  };
});

var AlpModule = function (_Component) {
  inherits(AlpModule, _Component);

  function AlpModule() {
    classCallCheck(this, AlpModule);
    return possibleConstructorReturn(this, (AlpModule.__proto__ || Object.getPrototypeOf(AlpModule)).apply(this, arguments));
  }

  createClass(AlpModule, [{
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return AlpModule;
}(Component);

// import AppContainer from '../layout/AppContainer';

var createModuleVisitor = (function () {
  var reducers = void 0;

  return {
    visitor: function visitor(element, instance) {
      // console.log(element, instance, instance instanceof AlpModule, element.type === AppContainer);

      if (instance && instance instanceof AlpModule) {
        // eslint-disable-next-line prefer-destructuring
        reducers = instance.props.reducers;
        return false;
      }

      return true;
    },

    getReducers: function getReducers() {
      return reducers;
    }
  };
});

var createAction = (function (type, handler) {
  var action = !handler ? function () {
    return { type: type };
  } : function () {
    return Object.assign({ type: type }, handler.apply(undefined, arguments));
  };
  action.type = type;
  action.toString = function () {
    return type;
  };
  return action;
}); // eslint-disable-next-line flowtype/no-weak-types

/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  if ((typeof defaultState === 'undefined' ? 'undefined' : _typeof(defaultState)) === 'object') {
    handlers = defaultState;
    defaultState = function defaultState() {
      return null;
    };
  }

  var handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState();
    var action = arguments[1];

    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}

/* global PRODUCTION */
function createLoader(handlers) {
  var handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));
  handlers = undefined;

  return function (state, data) {
    var keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      var handler = handlerMap.get(key);

      return handler(state, data[key]);
    })).then(function (results) {
      var data = Object.create(null);
      results.forEach(function (result, index) {
        data[keys[index]] = result;
      });
      return data;
    });
  };
}

// mergeProps: remove dispatch from dispatchProps (and perf !)
var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return ownProps;
};

var createPureStatelessComponent = (function (Component$$1) {
  return connect(null, null, mergeProps)(Component$$1);
});

var classNames = (function () {
  for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
    classNames[_key] = arguments[_key];
  }

  return classNames.filter(Boolean).join(' ');
});

var _class, _temp;

var AlpReduxModule = (_temp = _class = function (_AlpModule) {
  inherits(AlpReduxModule, _AlpModule);

  function AlpReduxModule(props, context) {
    classCallCheck(this, AlpReduxModule);

    var _this = possibleConstructorReturn(this, (AlpReduxModule.__proto__ || Object.getPrototypeOf(AlpReduxModule)).call(this, props, context));

    _this.state = {
      loading: _this.setModuleReducers(props.reducers)
    };
    return _this;
  }

  createClass(AlpReduxModule, [{
    key: 'setModuleReducers',
    value: function setModuleReducers(reducers) {
      var _this2 = this;

      if (!this.context.setModuleReducers) return false; // pre render
      var result = this.context.setModuleReducers(reducers);
      if (result === false) return false;
      result.then(function () {
        _this2.setState({ loading: false });
      });
      return true;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reducers !== this.props.reducers) {
        this.setState({
          loading: this.setModuleReducers(nextProps.reducers)
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.loading ? null : this.props.children;
    }
  }]);
  return AlpReduxModule;
}(AlpModule), _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);

var Body = (function (_ref) {
  var children = _ref.children;
  return React.createElement(
    'div',
    null,
    children
  );
});

var AppContainer = (function (_ref) {
  var children = _ref.children;
  return React.createElement(
    'div',
    null,
    children
  );
});

var logger = new Logger('alp:react-redux');

var hydrateApp = function hydrateApp(App) {
  return hydrate(React.createElement(App), document.getElementById('react-app'));
};

var preRender = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, appElement) {
    var moduleVisitor, preRenderStore, PreRenderWrappedApp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            moduleVisitor = createModuleVisitor();
            preRenderStore = { getState: function getState() {
                return { ctx: ctx };
              } };
            PreRenderWrappedApp = createAlpAppWrapper(appElement, {
              context: ctx,
              store: preRenderStore
            });
            _context.next = 5;
            return reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

          case 5:
            return _context.abrupt('return', moduleVisitor.getReducers());

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function preRender() {
    return _ref.apply(this, arguments);
  };
}();

var browser = (function (app) {
  app.reduxReducers = {
    loading: function loading() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var action = arguments[1];

      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    }
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(App) {
        var _this = this;

        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$middlewares = _ref3.middlewares,
            middlewares = _ref3$middlewares === undefined ? [] : _ref3$middlewares,
            sharedReducers = _ref3.sharedReducers;

        var store, moduleStoreReducer, createStore$$1, ctx, render;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                store = void 0;
                moduleStoreReducer = void 0;

                createStore$$1 = function createStore$$1(ctx, moduleReducers) {
                  moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
                  var store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
                    middlewares: middlewares,
                    sharedReducers: sharedReducers
                  });
                  app.store = store;
                  window.store = store;
                  return store;
                };

                ctx = app.createContext();

                render = function () {
                  var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(App) {
                    var appElement, moduleReducers, WrappedApp;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            appElement = React.createElement(App);
                            _context2.next = 3;
                            return preRender(ctx, appElement);

                          case 3:
                            moduleReducers = _context2.sent;

                            // in DEV
                            // eslint-disable-next-line no-lonely-if
                            if (!store) {
                              store = createStore$$1(ctx, moduleReducers);
                            } else {
                              moduleStoreReducer.setReducers(moduleReducers);
                            }
                            WrappedApp = createAlpAppWrapper(appElement, {
                              context: ctx,
                              store: store,
                              setModuleReducers: function setModuleReducers(reducers) {
                                return moduleStoreReducer.set(store, reducers);
                              }
                            });
                            _context2.next = 8;
                            return contentLoaded();

                          case 8:
                            hydrateApp(WrappedApp);
                            logger.success('rendered');

                          case 10:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function render() {
                    return _ref4.apply(this, arguments);
                  };
                }();

                _context3.next = 7;
                return render(App);

              case 7:
                return _context3.abrupt('return', render);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function renderApp() {
        return _ref2.apply(this, arguments);
      };
    }()
  };
});

export default browser;
export { AlpModule, AlpReduxModule, Body, AppContainer, createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer };
//# sourceMappingURL=index-browser.es.js.map
