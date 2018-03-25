import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { combineReducers, createStore } from 'redux';
export { combineReducers } from 'redux';
import { connect } from 'react-redux';
export { connect } from 'react-redux';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
export { default as Helmet } from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import createIsModernBrowser from 'modern-browsers';

var assetUrl = ((asset, version) => asset.startsWith('/') ? `/${version}${asset}` : asset);

/* global PRODUCTION */

function uneval(obj, keys, objects = new Set()) {
  switch (obj) {
    case null:
      return 'null';
    case undefined:
      return 'undefined';
    case Infinity:
      return 'Infinity';
    case -Infinity:
      return '-Infinity';
  }

  if (Number.isNaN(obj)) {
    return 'NaN';
  }

  switch (typeof obj) {
    case 'function':
      throw new Error(false);
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(obj);
  }

  if (objects.has(obj)) {
    throw new Error(false);
  }

  objects.add(obj);

  // specialized types
  if (obj instanceof Array) {
    return `[${obj.map(o => uneval(o, false, objects)).join(',')}]`;
  }

  if (obj instanceof Date) {
    return `new Date(${obj.getTime()})`;
  }

  if (obj instanceof Set) {
    return `new Set(${uneval(Array.from(obj), keys)})`;
  }

  if (obj instanceof Map) {
    return `new Map(${uneval(Array.from(obj), keys)})`;
  }

  return `{${Object.keys(obj).map(key => `${JSON.stringify(key)}:${uneval(obj[key], false)}`).join(',')}}`;
}

// https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.tm3hd6riw
const UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

const escapeUnsafeChars = unsafeChar => ESCAPED_CHARS[unsafeChar];

var uneval$1 = (obj => uneval(obj, 'obj').replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars));

var htmlLayout = ((helmet, content, {
  version,
  scriptName,
  styleName,
  initialData,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
}) => `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.base.toString()}
    <link rel="stylesheet" href="${assetUrl(`/${styleName || 'index'}.css`, version)}" />
    ${helmet.style.toString()}
    ${polyfillFeatures && `<script defer src="${`https://polyfill.io/v2/polyfill.min.js?features=${polyfillFeatures}&unknown=polyfill`}"></script>`}
    ${helmet.script.toString()}
    ${scriptName === false ? '' : `<script>
window.VERSION='${version}';
window.__INITIAL_DATA__=${uneval$1(initialData)};
</script>
<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="react-app">${content}</div>
  </body>
</html>`);

var createAlpAppWrapper = ((app, context) => {
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

var identityReducer = ((state = null) => state);

var createServerStore = ((ctx, moduleReducers, { sharedReducers }) => {
  const initialContext = Object.assign({
    ctx
  }, ctx.reduxInitialContext, {
    ctx: ctx
  });

  const rootReducer = combineReducers(Object.assign({}, ctx.app.reduxReducers, sharedReducers, {
    ctx: identityReducer,
    module: moduleReducers ? combineReducers(moduleReducers) : identityReducer
  }));

  return createStore(rootReducer, initialContext);
});

let AlpModule = class extends Component {

  render() {
    return this.props.children;
  }
};

// import AppContainer from '../layout/AppContainer';

var createModuleVisitor = (() => {
  let reducers;

  return {
    visitor: (element, instance) => {
      // console.log(element, instance, instance instanceof AlpModule, element.type === AppContainer);

      if (instance && instance instanceof AlpModule) {
        // eslint-disable-next-line prefer-destructuring
        reducers = instance.props.reducers;
        return false;
      }

      return true;
    },

    getReducers: () => reducers
  };
});

var createAction = ((type, handler) => {
  const action = !handler ? () => ({ type }) : (...args) => Object.assign({ type }, handler(...args));
  action.type = type;
  action.toString = () => type;
  return action;
}); // eslint-disable-next-line flowtype/no-weak-types

/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  if (typeof defaultState === 'object') {
    handlers = defaultState;
    defaultState = () => null;
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach(key => {
    if (typeof key === 'function') {
      handlerMap.set(key.type, handlers[key]);
    } else {
      handlerMap.set(key, handlers[key]);
    }
  });
  handlers = undefined;

  return (state = defaultState(), action) => {
    if (action && handlerMap.has(action.type)) {
      return handlerMap.get(action.type)(state, action);
    }

    return state;
  };
}

/* global PRODUCTION */
function createLoader(handlers) {
  const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));
  handlers = undefined;

  return (state, data) => {
    const keys = Object.keys(data);
    return Promise.all(keys.map(key => {
      const handler = handlerMap.get(key);

      return handler(state, data[key]);
    })).then(results => {
      const data = Object.create(null);
      results.forEach((result, index) => {
        data[keys[index]] = result;
      });
      return data;
    });
  };
}

// mergeProps: remove dispatch from dispatchProps (and perf !)
const mergeProps = (stateProps, dispatchProps, ownProps) => ownProps;

var createPureStatelessComponent = (Component$$1 => connect(null, null, mergeProps)(Component$$1));

var classNames = ((...classNames) => classNames.filter(Boolean).join(' '));

let AlpReduxModule = class extends AlpModule {

  render() {
    return this.props.children;
  }
};

var Body = (({ children }) => React.createElement(
  'div',
  null,
  children
));

var AppContainer = (({ children }) => React.createElement(
  'div',
  null,
  children
));

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

const logger = new Logger('alp:react-redux');

const renderHtml = (app, options) => {
  const content = renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

const isModernBrowser = createIsModernBrowser();

var index = (() => app => {
  app.reduxReducers = {};
  app.reduxMiddlewares = [];

  return {
    middleware: (ctx, next) => {
      ctx.reduxInitialContext = {};
      return next();
    },

    createApp: (App, options = {}) => async ctx => {
      const version = ctx.config.get('version');
      // TODO create alp-useragent with getter in context
      const ua = ctx.req.headers['user-agent'];
      const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';

      const app = React.createElement(App);
      const moduleVisitor = createModuleVisitor();

      const PreRenderWrappedApp = createAlpAppWrapper(app, { context: ctx, store: { getState: () => ({ ctx }) } });
      await reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

      const store = createServerStore(ctx, moduleVisitor.getReducers(), {
        sharedReducers: options.sharedReducers
      });

      const WrappedApp = createAlpAppWrapper(app, { context: ctx, store });

      // eslint-disable-next-line no-unused-vars
      const _store$getState = store.getState(),
            initialData = objectWithoutProperties(_store$getState, ['ctx']);
      ctx.body = await renderHtml(React.createElement(WrappedApp), {
        version,
        scriptName: options.scriptName !== undefined ? options.scriptName : name,
        styleName: options.styleName !== undefined ? options.styleName : name,
        polyfillFeatures: options.polyfillFeatures,
        initialData
      });
    }
  };
});

const loggerWebsocket = logger.child('websocket');

function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}

export default index;
export { AlpModule, AlpReduxModule, Body, AppContainer, emitAction, createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer };
//# sourceMappingURL=index-node8.es.js.map
