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

var createAlpAppWrapper = (function (app, context) {
  var _class, _temp2;

  return _temp2 = _class = class extends Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = {
        error: null
      }, _temp;
    }

    getChildContext() {
      return context;
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      if (this.state.error) return React.createElement(
        'div',
        null,
        'An unexpected error occured'
      );
      return app;
    }
  }, _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp2;
});

var identityReducer = (function (state = null) {
  return state;
});

const promiseMiddleware = function promiseMiddleware(store) {
  return function (next) {
    return function (action) {
      if (typeof action.then !== 'function') {
        return next(action);
      }

      return Promise.resolve(action).then(store.dispatch);
    };
  };
};

const createFunctionMiddleware = function createFunctionMiddleware(app) {
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

var createBrowserStore = (function (app, ctx, moduleReducer, { middlewares, sharedReducers }) {
  const reducers = Object.assign({}, app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducer
  });

  const rootReducer = combineReducers(reducers);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...app.reduxMiddlewares, ...middlewares];

  return createStore(rootReducer, Object.assign({ ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware(...middlewares)));
});

const MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

const createModuleReducer = function createModuleReducer(reducers) {
  return reducers ? combineReducers(reducers) : function (state = null) {
    return state;
  };
};

var createBrowserModuleStoreReducer = (function (initialReducers) {
  let _reducers = initialReducers;
  let moduleReducer = createModuleReducer(initialReducers);
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

let AlpModule = class extends Component {

  render() {
    return this.props.children;
  }
};

// import AppContainer from '../layout/AppContainer';

var createModuleVisitor = (function () {
  let reducers;

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
  const action = !handler ? function () {
    return { type };
  } : function (...args) {
    return Object.assign({ type }, handler(...args));
  };
  action.type = type;
  action.toString = function () {
    return type;
  };
  return action;
}); // eslint-disable-next-line flowtype/no-weak-types

/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = function defaultState() {
      return null;
    };
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return function (state = defaultState(), action) {
    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}

/* global PRODUCTION */
function createLoader(handlers) {
  const handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));
  handlers = undefined;

  return function (state, data) {
    const keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      const handler = handlerMap.get(key);

      return handler(state, data[key]);
    })).then(function (results) {
      const data = Object.create(null);
      results.forEach(function (result, index) {
        data[keys[index]] = result;
      });
      return data;
    });
  };
}

// mergeProps: remove dispatch from dispatchProps (and perf !)
const mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return ownProps;
};

var createPureStatelessComponent = (function (Component$$1) {
  return connect(null, null, mergeProps)(Component$$1);
});

var classNames = (function (...classNames) {
  return classNames.filter(Boolean).join(' ');
});

var _class, _temp;

let AlpReduxModule = (_temp = _class = class extends AlpModule {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: this.setModuleReducers(props.reducers)
    };
  }

  setModuleReducers(reducers) {
    var _this = this;

    if (!this.context.setModuleReducers) return false; // pre render
    const result = this.context.setModuleReducers(reducers);
    if (result === false) return false;
    result.then(function () {
      _this.setState({ loading: false });
    });
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reducers !== this.props.reducers) {
      this.setState({
        loading: this.setModuleReducers(nextProps.reducers)
      });
    }
  }

  render() {
    return this.state.loading ? null : this.props.children;
  }
}, _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);

var Body = (function ({ children }) {
  return React.createElement(
    'div',
    null,
    children
  );
});

var AppContainer = (function ({ children }) {
  return React.createElement(
    'div',
    null,
    children
  );
});

const logger = new Logger('alp:react-redux');

const hydrateApp = function hydrateApp(App) {
  return hydrate(React.createElement(App), document.getElementById('react-app'));
};

const preRender = async function preRender(ctx, appElement) {
  const moduleVisitor = createModuleVisitor();

  const PreRenderWrappedApp = createAlpAppWrapper(appElement, {
    context: ctx,
    store: { getState: function getState() {
        return { ctx };
      } }
  });
  await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

  return moduleVisitor.getReducers();
};

var browser = (function (app) {
  app.reduxReducers = {
    loading: function loading(state = 0, action) {
      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    }
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: async function renderApp(App, { middlewares = [], sharedReducers } = {}) {
      let store;
      let moduleStoreReducer;

      const createStore$$1 = function createStore$$1(ctx, moduleReducers) {
        moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
        const store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
          middlewares,
          sharedReducers
        });
        app.store = store;
        window.store = store;
        return store;
      };

      const ctx = app.createContext();

      const render = async function render(App) {
        let appElement = React.createElement(App);


        const moduleReducers = await preRender(ctx, appElement);

        // in DEV
        // eslint-disable-next-line no-lonely-if
        if (!store) {
          store = createStore$$1(ctx, moduleReducers);
        } else {
          moduleStoreReducer.setReducers(moduleReducers);
        }


        const WrappedApp = createAlpAppWrapper(appElement, {
          context: ctx,
          store,
          setModuleReducers: function setModuleReducers(reducers) {
            return moduleStoreReducer.set(store, reducers);
          }
        });

        await contentLoaded();
        hydrateApp(WrappedApp);
        logger.success('rendered');
      };

      await render(App);

      return render;
    }
  };
});

export default browser;
export { AlpModule, AlpReduxModule, Body, AppContainer, createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer };
//# sourceMappingURL=index-browsermodern.es.js.map
