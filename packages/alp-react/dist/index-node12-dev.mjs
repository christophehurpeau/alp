import isModernBrowser from 'modern-browsers';
import React, { Component, createContext } from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
export { default as Helmet } from 'react-helmet';
import ReactAlpContext from 'react-alp-context';

function createAlpAppWrapper(app, context) {
  var _temp;

  return _temp = class AlpAppWrapper extends Component {
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
      if (this.state.error) return /*#__PURE__*/React.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React.createElement(ReactAlpContext.Provider, {
        value: context
      }, app);
    }

  }, _temp;
}

const assetUrl = (asset, version) => asset.startsWith('/') ? `${asset}?${version}` : asset;

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

const LoadingFallbackContext = /*#__PURE__*/createContext('Loading...');

function AlpModuleNode(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, props.children);
}

function NodeSuspenseWrapper({
  children
}) {
  return children;
}

function Body({
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, children);
}

function AppContainer({
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
}

const renderHtml = (app, options) => {
  const content = renderToString(app);
  const helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

function alpReact(App, options = {}) {
  return ctx => {
    const version = ctx.config.get('version'); // TODO create alp-useragent with getter in context

    const ua = ctx.request.headers['user-agent'];
    const name = isModernBrowser(ua) ? 'modern-browsers' : 'es5';
    const app = /*#__PURE__*/React.createElement(App);
    const WrappedApp = createAlpAppWrapper(app, ctx);
    ctx.body = renderHtml( /*#__PURE__*/React.createElement(WrappedApp), {
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

export default alpReact;
export { AlpModuleNode as AlpModule, AppContainer, Body, LoadingFallbackContext, NodeSuspenseWrapper as SuspenseWrapper };
//# sourceMappingURL=index-node12-dev.mjs.map
