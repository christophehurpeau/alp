import _regeneratorRuntime from '@babel/runtime/regenerator';
import contentLoaded from 'content-loaded';
import React, { Component, createContext, useContext, Suspense } from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import ReactAlpContext from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

var _jsxFileName = "/home/chris/libs/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
function createAlpAppWrapper(app, context) {
  var _temp;

  return _temp =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      var _this, _len, args, _key;

      for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.state = {
        error: null,
        appState: context.sanitizedState
      };
      return _this;
    }

    var _proto = AlpAppWrapper.prototype;

    _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);

      if (window.Raven) {
        window.Raven.captureException(error, {
          extra: errorInfo
        });
      }
    };

    _proto.render = function render() {
      if (this.state.error) return React.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        },
        __self: this
      }, "An unexpected error occured");
      return React.createElement(ReactAlpContext.Provider, {
        value: context,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 35
        },
        __self: this
      }, app);
    };

    return AlpAppWrapper;
  }(Component), _temp;
}

var LoadingFallbackContext = createContext('Loading...');

var _jsxFileName$1 = "/home/chris/libs/alp/packages/alp-react/src/module/AlpModule.tsx";

function AlpModuleBrowser(props) {
  var loadingFallback = useContext(LoadingFallbackContext);
  return React.createElement(Suspense, {
    fallback: loadingFallback,
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 15
    },
    __self: this
  }, props.children);
}

var _jsxFileName$2 = "/home/chris/libs/alp/packages/alp-react/src/module/SuspenseWrapper.tsx";

function BrowserSuspenseWrapper(_ref2) {
  var children = _ref2.children;
  var loader = useContext(LoadingFallbackContext);
  return React.createElement(Suspense, {
    fallback: loader,
    __source: {
      fileName: _jsxFileName$2,
      lineNumber: 15
    },
    __self: this
  }, children);
}

var _jsxFileName$3 = "/home/chris/libs/alp/packages/alp-react/src/layout/Body.tsx";
function Body(_ref) {
  var children = _ref.children;
  return React.createElement("div", {
    __source: {
      fileName: _jsxFileName$3,
      lineNumber: 8
    },
    __self: this
  }, children);
}

function AppContainer(_ref) {
  var children = _ref.children;
  return React.createElement(React.Fragment, null, children);
}

var logger = new Logger('alp:react');
function alpReactBrowser(app) {
  return function renderApp(App) {
    var initialData, ctx, WrappedApp, appElement;
    return _regeneratorRuntime.async(function renderApp$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // eslint-disable-next-line no-underscore-dangle
            initialData = window.__INITIAL_DATA__ || {};
            ctx = app.createContext();

            if (initialData.sanitizedState) {
              ctx.sanitizedState = initialData.sanitizedState;
            }

            logger.success('render called');
            WrappedApp = createAlpAppWrapper(React.createElement(App), ctx);
            appElement = React.createElement(WrappedApp);
            _context.next = 8;
            return _regeneratorRuntime.awrap(contentLoaded());

          case 8:
            // const container =
            hydrate(appElement, document.getElementById('react-app'));
            logger.success('rendered'); // container.updateSanitizedState({ loading: false });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  };
}

export default alpReactBrowser;
export { AlpModuleBrowser as AlpModule, AppContainer, Body, LoadingFallbackContext, BrowserSuspenseWrapper as SuspenseWrapper };
//# sourceMappingURL=index-browser-dev.es.js.map
