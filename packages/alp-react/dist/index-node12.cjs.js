'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isModernBrowser = require('modern-browsers');
const React = require('react');
const server = require('react-dom/server');
const Helmet = require('react-helmet');
const ReactAlpContext = require('react-alp-context');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const isModernBrowser__default = /*#__PURE__*/_interopDefaultLegacy(isModernBrowser);
const React__default = /*#__PURE__*/_interopDefaultLegacy(React);
const Helmet__default = /*#__PURE__*/_interopDefaultLegacy(Helmet);
const ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);

function createAlpAppWrapper(app, context) {
  return class AlpAppWrapper extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        error: null
      };
    }

    componentDidCatch(error, errorInfo) {
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
    }

    render() {
      if (this.state.error) return /*#__PURE__*/React__default.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React__default.createElement(ReactAlpContext__default.Provider, {
        value: context
      }, app);
    }

  };
}

const assetUrl = (asset, version) => asset.startsWith('/') ? `/${version}${asset}` : asset;

/* eslint-disable complexity */
function uneval(value, keys, objects = new Set()) {
  switch (value) {
    case null:
      return 'null';

    case undefined:
      return 'undefined';

    case Infinity:
      return 'Infinity';

    case -Infinity:
      return '-Infinity';
  }

  if (Number.isNaN(value)) {
    return 'NaN';
  }

  switch (typeof value) {
    case 'function':
      throw new Error(undefined);

    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(value);
  }

  if (objects.has(value)) {
    throw new Error(undefined);
  }

  objects.add(value); // specialized types

  if (Array.isArray(value)) {
    return `[${value.map((o, index) => uneval(o, undefined, objects)).join(',')}]`;
  }

  if (value instanceof Date) {
    return `new Date(${value.getTime()})`;
  }

  if (value instanceof Set) {
    return `new Set(${uneval([...value])})`;
  }

  if (value instanceof Map) {
    return `new Map(${uneval([...value])})`;
  }

  return `{${Object.keys(value).map(key => `${JSON.stringify(key)}:${uneval(value[key])}`).join(',')}}`;
} // https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.tm3hd6riw


const UNSAFE_CHARS_REGEXP = /[/<>\u2028\u2029]/g;
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

const escapeUnsafeChars = unsafeChar => ESCAPED_CHARS[unsafeChar];

function unevalValue(value) {
  return uneval(value).replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
}

function htmlLayout(helmet, content, {
  version,
  scriptName,
  styleName,
  initialData,
  polyfillFeatures = 'default,es2015,es2016,es2017,localStorage,fetch,Intl'
}) {
  return `<!doctype html>
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
window.__VERSION__='${version}';
window.__INITIAL_DATA__=${unevalValue(initialData)};
</script>
<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="react-app">${content}</div>
  </body>
</html>`;
}

const LoadingFallbackContext = /*#__PURE__*/React.createContext('Loading...');

function AlpModuleNode(props) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, props.children);
}

function NodeSuspenseWrapper({
  children
}) {
  return children;
}

function Body({
  children
}) {
  return /*#__PURE__*/React__default.createElement("div", null, children);
}

function AppContainer({
  children
}) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, children);
}

const renderHtml = (app, options) => {
  const content = server.renderToString(app);
  const helmet = Helmet__default.renderStatic();
  return htmlLayout(helmet, content, options);
};

function alpReact(App, options = {}) {
  return ctx => {
    const version = ctx.config.get('version'); // TODO create alp-useragent with getter in context

    const ua = ctx.request.headers['user-agent'];
    const name = isModernBrowser__default(ua) ? 'modern-browsers' : 'es5';
    const app = /*#__PURE__*/React__default.createElement(App);
    const WrappedApp = createAlpAppWrapper(app, ctx);
    ctx.body = renderHtml( /*#__PURE__*/React__default.createElement(WrappedApp), {
      version,
      scriptName: options.scriptName !== undefined ? options.scriptName : name,
      styleName: options.styleName !== undefined ? options.styleName : name,
      polyfillFeatures: options.polyfillFeatures,
      initialData: {
        sanitizedState: ctx.sanitizedState
      }
    });
  };
}

exports.Helmet = Helmet__default;
exports.AlpModule = AlpModuleNode;
exports.AppContainer = AppContainer;
exports.Body = Body;
exports.LoadingFallbackContext = LoadingFallbackContext;
exports.SuspenseWrapper = NodeSuspenseWrapper;
exports.default = alpReact;
//# sourceMappingURL=index-node12.cjs.js.map
