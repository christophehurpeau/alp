'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = require('react');
const React__default = _interopDefault(React);
const server = require('react-dom/server');
const Helmet = _interopDefault(require('react-helmet'));
const createIsModernBrowser = _interopDefault(require('modern-browsers'));
const ReactAlpContext = _interopDefault(require('react-alp-context'));

const assetUrl = (asset, version) => asset.startsWith('/') ? `${asset}?${version}` : asset;

/* eslint-disable default-case */
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
      console.log(value);
      throw new Error(`Unsupported function "${keys}".`);

    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(value);
  }

  if (objects.has(value)) {
    throw new Error('Circular reference detected.');
  }

  objects.add(value); // specialized types

  if (Array.isArray(value)) {
    return `[${value.map((o, index) => uneval(o, `${keys}[${index}]`, objects)).join(',')}]`;
  }

  if (value instanceof Date) {
    return `new Date(${value.getTime()})`;
  }

  if (value instanceof Set) {
    return `new Set(${uneval([...value], keys)})`;
  }

  if (value instanceof Map) {
    return `new Map(${uneval([...value], keys)})`;
  }

  return `{${Object.keys(value).map(key => `${JSON.stringify(key)}:${uneval(value[key], `${keys}.${key}`)}`).join(',')}}`;
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
  return uneval(value, 'obj').replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
}

/* eslint-disable jsx-a11y/html-has-lang */
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

var _jsxFileName = "/home/chris/libs/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
function createAlpAppWrapper(app, context) {
  var _temp;

  return _temp = class AlpAppWrapper extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        error: null,
        appState: context.sanitizedState
      };
    }

    componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);

      if (window.Raven) {
        window.Raven.captureException(error, {
          extra: errorInfo
        });
      }
    }

    render() {
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
    }

  }, _temp;
}

const LoadingFallbackContext = React.createContext('Loading...');

function AlpModuleNode(props) {
  return React__default.createElement(React__default.Fragment, null, props.children);
}

function NodeSuspenseWrapper({
  children
}) {
  return children;
}

var _jsxFileName$1 = "/home/chris/libs/alp/packages/alp-react/src/layout/Body.tsx";
function Body({
  children
}) {
  return React__default.createElement("div", {
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 8
    },
    __self: this
  }, children);
}

function AppContainer({
  children
}) {
  return React__default.createElement(React__default.Fragment, null, children);
}

const renderHtml = (app, options) => {
  const content = server.renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

const isModernBrowser = createIsModernBrowser();
function alpReact(App, options = {}) {
  return ctx => {
    const version = ctx.config.get('version'); // TODO create alp-useragent with getter in context

    const ua = ctx.req.headers['user-agent'];
    const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';
    const app = React__default.createElement(App);
    const WrappedApp = createAlpAppWrapper(app, ctx);
    ctx.body = renderHtml(React__default.createElement(WrappedApp), {
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

exports.Helmet = Helmet;
exports.AlpModule = AlpModuleNode;
exports.AppContainer = AppContainer;
exports.Body = Body;
exports.LoadingFallbackContext = LoadingFallbackContext;
exports.SuspenseWrapper = NodeSuspenseWrapper;
exports.default = alpReact;
//# sourceMappingURL=index-node10-dev.cjs.js.map
