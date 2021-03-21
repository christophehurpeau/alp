import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import contentLoaded from 'content-loaded';
import Logger from 'nightingale-logger';
import React, { Component, createContext, useContext, Suspense } from 'react';
import { hydrate } from 'react-dom';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import ReactAlpContext from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

function createAlpAppWrapper(app, context) {
  return /*#__PURE__*/function (_Component) {
    _inheritsLoose(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      var _this, _len, args, _key;

      for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.state = {
        error: null
      };
      return _this;
    }

    var _proto = AlpAppWrapper.prototype;

    _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
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
    };

    _proto.render = function render() {
      if (this.state.error) return /*#__PURE__*/React.createElement("div", null, "An unexpected error occured");
      return /*#__PURE__*/React.createElement(ReactAlpContext.Provider, {
        value: context
      }, app);
    };

    return AlpAppWrapper;
  }(Component);
}

var LoadingFallbackContext = /*#__PURE__*/createContext('Loading...');

function AlpModuleBrowser(props) {
  var loadingFallback = useContext(LoadingFallbackContext);
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: loadingFallback
  }, props.children);
}

function BrowserSuspenseWrapper(_ref2) {
  var children = _ref2.children;
  var loader = useContext(LoadingFallbackContext);
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: loader
  }, children);
}

function Body(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement("div", null, children);
}

function AppContainer(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
}

var logger = new Logger('alp:react');
function alpReactBrowser(app) {
  return /*#__PURE__*/function () {
    var _renderApp = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(App) {
      var initialData, ctx, WrappedApp, appElement;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              initialData = window.__INITIAL_DATA__ || {};
              ctx = app.createContext();

              if (initialData.sanitizedState) {
                ctx.sanitizedState = initialData.sanitizedState;
              }

              logger.success('render called');
              WrappedApp = createAlpAppWrapper( /*#__PURE__*/React.createElement(App), ctx);
              appElement = /*#__PURE__*/React.createElement(WrappedApp);
              _context.next = 8;
              return contentLoaded();

            case 8:
              // const container =
              hydrate(appElement, document.getElementById('react-app'));
              logger.success('rendered'); // container.updateSanitizedState({ loading: false });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function renderApp() {
      return _renderApp.apply(this, arguments);
    };
  }();
}

export default alpReactBrowser;
export { AlpModuleBrowser as AlpModule, AppContainer, Body, LoadingFallbackContext, BrowserSuspenseWrapper as SuspenseWrapper };
//# sourceMappingURL=index-browser-dev.es.js.map
