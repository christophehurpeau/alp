import React, { Component, Element, Node } from 'react';
import PropTypes from 'prop-types';
import t from 'flow-runtime';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
export { combineReducers } from 'redux';
import { connect } from 'react-redux';
export { connect } from 'react-redux';
import contentLoaded from 'content-loaded';
import { hydrate } from 'react-dom';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import reactHelmet from 'react-helmet';
export { default as Helmet } from 'react-helmet';

const Element$1 = t.tdz(function () {
  return Element;
});
const PropsType = t.type('PropsType', t.exactObject());


var createAlpAppWrapper = (function (app, context) {
  var _class, _temp2;

  let _appType = t.ref(Element$1);

  let _contextType = t.object();

  t.param('app', _appType).assert(app);
  t.param('context', _contextType).assert(context);
  return _temp2 = _class = class extends Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = {
        error: null
      }, _temp;
    }

    getChildContext() {
      const _returnType = t.return(t.object());

      return _returnType.assert(context);
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      const _returnType2 = t.return(t.ref(Element$1));

      if (this.state.error) return _returnType2.assert(React.createElement(
        'div',
        null,
        'An unexpected error occured'
      ));
      return _returnType2.assert(app);
    }
  }, _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
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

  Object.keys(reducers).forEach(function (key) {
    if (typeof reducers[key] !== 'function') throw new Error(`Invalid reducer ${key}`);
  });


  const rootReducer = combineReducers(reducers);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  middlewares = [createFunctionMiddleware(app), promiseMiddleware, ...app.reduxMiddlewares, ...middlewares];

  return createStore(rootReducer, Object.assign({ ctx }, window.__INITIAL_DATA__), composeEnhancers(applyMiddleware(...middlewares)));
});

const ReduxActionType = t.type("ReduxActionType", t.object(t.property("type", t.string())));
const ReduxDispatchType = t.type("ReduxDispatchType", t.function(t.param("action", ReduxActionType), t.return(t.union(ReduxActionType, t.any()))));
const ReduxReducerType = t.type("ReduxReducerType", t.function(t.param("state", t.any()), t.param("action", ReduxActionType), t.return(t.any())));
const ReducerDictionaryType = t.type("ReducerDictionaryType", t.object(t.indexer("key", t.string(), ReduxReducerType)));

const ReducerDictionaryType$1 = t.tdz(function () {
  return ReducerDictionaryType;
});
const MODULE_INIT_TYPE = '@@alp-redux/INIT_MODULE';

// https://github.com/insin/react-examples/tree/master/code-splitting-redux-reducers
// https://medium.com/@luigiplr/react-redux-react-router-4-code-splitting-w-rxjs-webpack-32eabedf0e9
// https://gist.github.com/gaearon/0a2213881b5d53973514
// https://github.com/zeit/next.js/pull/1459

const createModuleReducer = function createModuleReducer(reducers) {
  let _reducersType = t.nullable(t.ref(ReducerDictionaryType$1));

  t.param('reducers', _reducersType).assert(reducers);
  return reducers ? combineReducers(reducers) : function (state = null) {
    return state;
  };
};

var createBrowserModuleStoreReducer = (function (initialReducers) {
  let _initialReducersType = t.nullable(t.ref(ReducerDictionaryType$1));

  t.param('initialReducers', _initialReducersType).assert(initialReducers);

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

var _class, _temp;
const Node$1 = t.tdz(function () {
  return Node;
});
const PropsType$1 = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node$1))));
let AlpModule = (_temp = _class = class extends Component {

  render() {
    const _returnType = t.return(t.ref(Node$1));

    // eslint-disable-next-line react/prop-types
    if (this.props.reducers) {
      throw new Error('You have reducers, probably want to use AlpReduxModule.');
    }

    return _returnType.assert(this.props.children);
  }
}, _class.propTypes = t.propTypes(PropsType$1), _temp);

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

// eslint-disable-next-line flowtype/no-weak-types
const HandlerType = t.type("HandlerType", t.function(t.rest("args", t.array(t.any())), t.return(t.object())));


var createAction = (function (type, handler) {
  let _typeType = t.string();

  let _handlerType = t.nullable(HandlerType);

  t.param("type", _typeType).assert(type);
  t.param("handler", _handlerType).assert(handler);

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
});

/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  let _defaultStateType = t.union(t.function(), t.object());

  let _handlersType = t.nullable(t.object());

  t.param('defaultState', _defaultStateType).assert(defaultState);
  t.param('handlers', _handlersType).assert(handlers);

  if (typeof defaultState === 'object') {
    handlers = _handlersType.assert(defaultState);
    defaultState = _defaultStateType.assert(function () {
      return null;
    });
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach(function (key) {
    if (typeof key === 'function') {
      if (typeof key.type !== 'string') {
        throw new Error(`Invalid handler key: "${key.name}"`);
      }
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = _handlersType.assert(undefined);

  return function (state = defaultState(), action) {
    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}

/* global PRODUCTION */
function createLoader(handlers) {
  let _handlersType = t.nullable(t.object());

  t.param("handlers", _handlersType).assert(handlers);

  const handlerMap = new Map(Object.keys(handlers).map(function (key) {
    return [key, handlers[key]];
  }));
  handlers = _handlersType.assert(undefined);

  return function (state, data) {
    const keys = Object.keys(data);
    return Promise.all(keys.map(function (key) {
      const handler = handlerMap.get(key);
      if (!handler) throw new Error(`Missing handler for "${key}".`);
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

var _class$1, _temp$1;
const ReducerDictionaryType$2 = t.tdz(function () {
  return ReducerDictionaryType;
});
const Node$2 = t.tdz(function () {
  return Node;
});
const PropsType$2 = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node$2)), t.property('reducers', t.nullable(t.ref(ReducerDictionaryType$2)))));
let AlpReduxModule = (_temp$1 = _class$1 = class extends AlpModule {

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
    let _nextPropsType = t.ref(PropTypes);

    t.param('nextProps', _nextPropsType).assert(nextProps);

    if (nextProps.reducers !== this.props.reducers) {
      this.setState({
        loading: this.setModuleReducers(nextProps.reducers)
      });
    }
  }

  render() {
    const _returnType = t.return(t.ref(Node$2));

    return _returnType.assert(this.state.loading ? null : this.props.children);
  }
}, _class$1.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp$1);

const Node$3 = t.tdz(function () {
  return Node;
});
const Props = t.type('Props', t.exactObject(t.property('children', t.ref(Node$3))));


var Body = (function (_arg) {
  let { children } = Props.assert(_arg);
  return React.createElement(
    'div',
    null,
    children
  );
});

const Element$2 = t.tdz(function () {
  return Element;
});
const Node$4 = t.tdz(function () {
  return Node;
});
const PropsType$3 = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node$4))));


var AppContainer = (function (_arg) {
  const _returnType = t.return(t.ref(Element$2, t.string('div')));

  let { children } = PropsType$3.assert(_arg);
  return _returnType.assert(React.createElement(
    'div',
    null,
    children
  ));
});

const ReduxActionType$1 = t.tdz(function () {
  return ReduxActionType;
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
      let _stateType = t.nullable(t.number());

      let _actionType = t.ref(ReduxActionType$1);

      t.param('state', _stateType).assert(state);
      t.param('action', _actionType).assert(action);

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

        appElement = React.createElement(BrowserAppContainer, {}, appElement);


        const moduleReducers = await preRender(ctx, appElement);

        store = createStore$$1(ctx, moduleReducers);


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
export { AlpModule, AlpReduxModule, Body, AppContainer, createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer, ReduxActionType, ReduxDispatchType, ReduxReducerType, ReducerDictionaryType };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
