import contentLoaded from 'content-loaded';
import React__default, { Component, createElement, Fragment } from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
import ReactAlpContext from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
const createAlpAppWrapper = (function (app, context) {
  var _temp;

  return _temp = class AlpAppWrapper extends Component {
    constructor(...args) {
      super(...args);
      this.state = {
        error: null,
        appState: context.sanitizedState
      };
    }

    componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, {
        extra: errorInfo
      });
    }

    render() {
      if (this.state.error) return React__default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        },
        __self: this
      }, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33
        },
        __self: this
      }, app);
    }

  }, _temp;
});

class AlpModule extends Component {
  render() {
    return this.props.children;
  }

}

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/Body.tsx";
const Body = (function ({
  children
}) {
  return React__default.createElement("div", {
    __source: {
      fileName: _jsxFileName$1,
      lineNumber: 8
    },
    __self: this
  }, children);
});

const AppContainer = (function ({
  children
}) {
  return createElement(Fragment, null, children);
});

const logger = new Logger('alp:react');
const browser = (function (app // loading: (state: number = 0, action: ReduxActionType) => {
//   if (action.meta && action.meta.loading !== undefined) {
//     return state + (action.meta.loading ? 1 : -1);
//   }
//   return state;
// },
) {
  return async function renderApp(App) {
    const initialData = window.__INITIAL_DATA__ || {};
    const ctx = app.createContext();

    if (initialData.sanitizedState) {
      ctx.sanitizedState = initialData.sanitizedState;
    }

    logger.success('render called');
    const WrappedApp = createAlpAppWrapper(React__default.createElement(App), ctx);
    const appElement = React__default.createElement(WrappedApp);
    await contentLoaded(); // const container =

    hydrate(appElement, document.getElementById('react-app'));
    logger.success('rendered'); // container.updateSanitizedState({ loading: false });
  };
});

export default browser;
export { AlpModule, AppContainer, Body };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
