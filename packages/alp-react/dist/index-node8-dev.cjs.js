'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var server = require('react-dom/server');
var Helmet = _interopDefault(require('react-helmet'));
var createIsModernBrowser = _interopDefault(require('modern-browsers'));
var ReactAlpContext = require('react-alp-context');
var ReactAlpContext__default = _interopDefault(ReactAlpContext);

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


const UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

const escapeUnsafeChars = unsafeChar => ESCAPED_CHARS[unsafeChar];

var uneval$1 = (value => uneval(value, 'obj').replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars));

/* eslint-disable jsx-a11y/html-has-lang */
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
window.__VERSION__='${version}';
window.__INITIAL_DATA__=${uneval$1(initialData)};
</script>
<script defer src="${assetUrl(`/${scriptName}.js`, version)}"></script>`}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="react-app">${content}</div>
  </body>
</html>`);

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
var createAlpAppWrapper = ((app, context) => {
  var _temp;

  return _temp = class extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        error: null,
        appState: context.sanitizedState
      };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        error
      });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, {
        extra: errorInfo
      });
    }

    updateSanitizedState(patchState) {
      this.setState(prevState => ({
        appState: { ...prevState.appState,
          patchState
        }
      }));
    }

    render() {
      if (this.state.error) return React__default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext__default.Provider, {
        value: context,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, React__default.createElement(ReactAlpContext.AppStateContext.Provider, {
        value: this.state.appState,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, app));
    }

  }, _temp;
});

class AlpModule extends React.Component {
  render() {
    return this.props.children;
  }

}

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/Body.tsx";
var Body = (({
  children
}) => React__default.createElement("div", {
  __source: {
    fileName: _jsxFileName$1,
    lineNumber: 8
  },
  __self: void 0
}, children));

var _jsxFileName$2 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/AppContainer.tsx";
var AppContainer = (({
  children
}) => React.createElement("div", {
  __source: {
    fileName: _jsxFileName$2,
    lineNumber: 7
  },
  __self: void 0
}, children));

const renderHtml = (app, options) => {
  const content = server.renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

const isModernBrowser = createIsModernBrowser();
var index = ((App, options = {}) => async ctx => {
  const version = ctx.config.get('version'); // TODO create alp-useragent with getter in context

  const ua = ctx.req.headers['user-agent'];
  const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';
  const app = React__default.createElement(App);
  const WrappedApp = createAlpAppWrapper(app, ctx);
  ctx.body = await renderHtml(React__default.createElement(WrappedApp), {
    version,
    scriptName: options.scriptName !== undefined ? options.scriptName : name,
    styleName: options.styleName !== undefined ? options.styleName : name,
    polyfillFeatures: options.polyfillFeatures,
    initialData: {
      sanitizedState: ctx.sanitizedState
    }
  });
});

exports.Helmet = Helmet;
exports.default = index;
exports.AlpModule = AlpModule;
exports.Body = Body;
exports.AppContainer = AppContainer;
//# sourceMappingURL=index-node8-dev.cjs.js.map
