import contentLoaded from 'content-loaded';
import React__default, { Component, createElement } from 'react';
import { hydrate } from 'react-dom';
import Logger from 'nightingale-logger';
import ReactAlpContext, { AppStateContext } from 'react-alp-context';
export { default as Helmet } from 'react-helmet';

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/alp-react/src/createAlpAppWrapper.tsx";
var createAlpAppWrapper = (function (app, context) {
  var _temp;

  return _temp = class extends Component {
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
      this.setState(function (prevState) {
        return {
          appState: Object.assign({}, prevState.appState, {
            patchState
          })
        };
      });
    }

    render() {
      if (this.state.error) return React__default.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, "An unexpected error occured");
      return React__default.createElement(ReactAlpContext.Provider, {
        value: context,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 40
        },
        __self: this
      }, React__default.createElement(AppStateContext.Provider, {
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

class AlpModule extends Component {
  render() {
    return this.props.children;
  }

}

var _jsxFileName$1 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/Body.tsx";
var Body = (function ({
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

var _jsxFileName$2 = "/Users/chris/Work/alp/alp/packages/alp-react/src/layout/AppContainer.tsx";
var AppContainer = (function ({
  children
}) {
  return createElement("div", {
    __source: {
      fileName: _jsxFileName$2,
      lineNumber: 7
    },
    __self: this
  }, children);
});

const logger = new Logger('alp:react');
var browser = (function (app // loading: (state: number = 0, action: ReduxActionType) => {
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
    await contentLoaded();
    hydrate(appElement, document.getElementById('react-app'));
    logger.success('rendered'); // container.updateSanitizedState({ loading: false });
  };
});

export default browser;
export { AlpModule, Body, AppContainer };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
