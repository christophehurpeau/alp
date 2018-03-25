import React, { Element, Component, Node } from 'react';
import t from 'flow-runtime';
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

var assetUrl = ((asset, version) => asset.startsWith('/') ? `${asset}?${version}` : asset);

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
      console.log(obj);
      throw new Error(`Unsupported function "${keys}".`);
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(obj);
  }

  if (objects.has(obj)) {
    throw new Error('Circular reference detected.');
  }

  objects.add(obj);

  // specialized types
  if (obj instanceof Array) {
    return `[${obj.map((o, index) => uneval(o, `${keys}[${index}]`, objects)).join(',')}]`;
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

  return `{${Object.keys(obj).map(key => `${JSON.stringify(key)}:${uneval(obj[key], `${keys}.${key}`)}`).join(',')}}`;
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

/* eslint-disable jsx-a11y/html-has-lang, prefer-template */
const Element$1 = t.tdz(() => Element);
const HelmetDataAttributeType = t.type('HelmetDataAttributeType', t.object(t.property('toString', t.function(t.return(t.string()))), t.property('toComponent', t.function(t.return(t.ref(Element$1))))));
const HelmetDataType = t.type('HelmetDataType', t.object(t.property('htmlAttributes', HelmetDataAttributeType), t.property('title', HelmetDataAttributeType), t.property('base', HelmetDataAttributeType), t.property('meta', HelmetDataAttributeType), t.property('link', HelmetDataAttributeType), t.property('script', HelmetDataAttributeType), t.property('style', HelmetDataAttributeType)));


const LayoutOptionsType = t.type('LayoutOptionsType', t.exactObject(t.property('layoutBody', t.nullable(t.function()), true), t.property('version', t.string()), t.property('scriptName', t.union(t.string(), t.boolean(false))), t.property('styleName', t.union(t.string(), t.boolean(false))), t.property('initialData', t.nullable(t.any()), true), t.property('polyfillFeatures', t.nullable(t.string()), true)));

var htmlLayout = ((helmet, content, {
  version,
  scriptName,
  styleName,
  initialData,
  polyfillFeatures = 'default,es6,es7,localStorage,fetch,Intl'
}) => {
  let _contentType = t.string();

  const _returnType = t.return(t.string());

  t.param('helmet', HelmetDataType).assert(helmet);
  t.param('content', _contentType).assert(content);
  return _returnType.assert(`<!doctype html>
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
});

const Element$2 = t.tdz(() => Element);
const PropsType = t.type('PropsType', t.exactObject());


var createAlpAppWrapper = ((app, context) => {
  var _class, _temp2;

  let _appType = t.ref(Element$2);

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
      const _returnType2 = t.return(t.ref(Element$2));

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

var _class, _temp;
const Node$1 = t.tdz(() => Node);
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

const ReduxActionType = t.type("ReduxActionType", t.object(t.property("type", t.string())));
const ReduxDispatchType = t.type("ReduxDispatchType", t.function(t.param("action", ReduxActionType), t.return(t.union(ReduxActionType, t.any()))));
const ReduxReducerType = t.type("ReduxReducerType", t.function(t.param("state", t.any()), t.param("action", ReduxActionType), t.return(t.any())));
const ReducerDictionaryType = t.type("ReducerDictionaryType", t.object(t.indexer("key", t.string(), ReduxReducerType)));

// eslint-disable-next-line flowtype/no-weak-types
const HandlerType = t.type("HandlerType", t.function(t.rest("args", t.array(t.any())), t.return(t.object())));


var createAction = ((type, handler) => {
  let _typeType = t.string();

  let _handlerType = t.nullable(HandlerType);

  t.param("type", _typeType).assert(type);
  t.param("handler", _handlerType).assert(handler);

  const action = !handler ? () => ({ type }) : (...args) => Object.assign({ type }, handler(...args));
  action.type = type;
  action.toString = () => type;
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
    defaultState = _defaultStateType.assert(() => null);
  }

  const handlerMap = new Map();
  Object.keys(handlers).forEach(key => {
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

  return (state = defaultState(), action) => {
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

  const handlerMap = new Map(Object.keys(handlers).map(key => [key, handlers[key]]));
  handlers = _handlersType.assert(undefined);

  return (state, data) => {
    const keys = Object.keys(data);
    return Promise.all(keys.map(key => {
      const handler = handlerMap.get(key);
      if (!handler) throw new Error(`Missing handler for "${key}".`);
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

const ReducerDictionaryType$1 = t.tdz(() => ReducerDictionaryType);
const Node$2 = t.tdz(() => Node);
const PropsType$2 = t.type('PropsType', t.exactObject(t.property('reducers', t.nullable(t.ref(ReducerDictionaryType$1))), t.property('children', t.ref(Node$2))));
let AlpReduxModule = class extends AlpModule {

  render() {
    const _returnType = t.return(t.ref(Node$2));

    return _returnType.assert(this.props.children);
  }
};

const Node$3 = t.tdz(() => Node);
const Props = t.type('Props', t.exactObject(t.property('children', t.ref(Node$3))));


var Body = (_arg => {
  let { children } = Props.assert(_arg);
  return React.createElement(
    'div',
    null,
    children
  );
});

const Element$3 = t.tdz(() => Element);
const Node$4 = t.tdz(() => Node);
const PropsType$3 = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node$4))));


var AppContainer = (_arg => {
  const _returnType = t.return(t.ref(Element$3, t.string('div')));

  let { children } = PropsType$3.assert(_arg);
  return _returnType.assert(React.createElement(
    'div',
    null,
    children
  ));
});

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

const ReduxActionType$1 = t.tdz(() => ReduxActionType);


const logger = new Logger('alp:react-redux');

const renderHtml = (app, options) => {
  const content = renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

const isModernBrowser = createIsModernBrowser();

const OptionsType = t.type('OptionsType', t.exactObject(t.property('polyfillFeatures', t.nullable(t.string()), true), t.property('scriptName', t.union(t.nullable(t.string()), t.boolean(false)), true), t.property('sharedReducers', t.nullable(t.object(t.indexer('key', t.string(), t.any()))), true), t.property('styleName', t.union(t.nullable(t.string()), t.boolean(false)), true)));


var index = (() => app => {
  app.reduxReducers = {};
  app.reduxMiddlewares = [];

  return {
    middleware: (ctx, next) => {
      ctx.reduxInitialContext = {};
      return next();
    },

    createApp: (App, options = {}) => {
      let _optionsType = t.nullable(OptionsType);

      t.param('options', _optionsType).assert(options);
      return async ctx => {
        const version = t.string().assert(ctx.config.get('version'));
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
      };
    }
  };
});

const loggerWebsocket = logger.child('websocket');

function emitAction(to, action) {
  let _toType = t.string();

  let _actionType = t.ref(ReduxActionType$1);

  t.param('to', _toType).assert(to);
  t.param('action', _actionType).assert(action);

  loggerWebsocket.debug('emitAction', action);
  to.emit('redux:action', action);
}

export default index;
export { AlpModule, AlpReduxModule, Body, AppContainer, emitAction, createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer };
//# sourceMappingURL=index-node8-dev.es.js.map
