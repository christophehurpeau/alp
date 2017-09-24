var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// eslint-disable-next-line
import BrowserAppContainer from 'pobpack-browser/BrowserAppContainer';
import contentLoaded from 'content-loaded';
import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
import createModuleVisitor from './module/createModuleVisitor';
import { ReduxActionType as _ReduxActionType } from './types';

import t from 'flow-runtime';
var ReduxActionType = t.tdz(function () {
  return _ReduxActionType;
});
export { Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer } from './utils/index';
import _AlpModule from './module/AlpModule';
export { _AlpModule as AlpModule };
import _AlpReduxModule from './module/AlpReduxModuleBrowser';
export { _AlpReduxModule as AlpReduxModule };
import _Body from './layout/Body';
export { _Body as Body };
import _AppContainer from './layout/AppContainer';
export { _AppContainer as AppContainer };


var logger = new Logger('alp:react-redux');

var _renderApp = function _renderApp(App) {
  return render(React.createElement(App), document.getElementById('react-app'));
};

var preRender = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, appElement) {
    var moduleVisitor, preRenderStore, PreRenderWrappedApp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            moduleVisitor = createModuleVisitor();
            preRenderStore = { getState: function getState() {
                return { ctx: ctx };
              } };
            PreRenderWrappedApp = createAlpAppWrapper(appElement, {
              context: ctx,
              store: preRenderStore
            });
            _context.next = 5;
            return reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

          case 5:
            return _context.abrupt('return', moduleVisitor.getReducers());

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function preRender() {
    return _ref.apply(this, arguments);
  };
}();

export default (function browser(app) {
  app.reduxReducers = {
    loading: function loading() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var action = arguments[1];

      var _stateType = t.nullable(t.number());

      var _actionType = t.ref(ReduxActionType);

      t.param('state', _stateType).assert(state);
      t.param('action', _actionType).assert(action);

      if (action.meta && action.meta.loading !== undefined) {
        return state + (action.meta.loading ? 1 : -1);
      }
      return state;
    }
  };
  app.reduxMiddlewares = [];

  return {
    renderApp: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(App) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$middlewares = _ref3.middlewares,
            middlewares = _ref3$middlewares === undefined ? [] : _ref3$middlewares,
            sharedReducers = _ref3.sharedReducers;

        var store, moduleStoreReducer, createStore, ctx, render;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                store = void 0;
                moduleStoreReducer = void 0;

                createStore = function createStore(ctx, moduleReducers) {
                  moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
                  var store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
                    middlewares: middlewares,
                    sharedReducers: sharedReducers
                  });
                  app.store = store;
                  window.store = store;
                  return store;
                };

                ctx = app.createContext();

                render = function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(App) {
                    var appElement, moduleReducers, WrappedApp;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            appElement = React.createElement(App);

                            appElement = React.createElement(BrowserAppContainer, {}, appElement);
                            _context2.next = 4;
                            return preRender(ctx, appElement);

                          case 4:
                            moduleReducers = _context2.sent;

                            store = createStore(ctx, moduleReducers);
                            WrappedApp = createAlpAppWrapper(appElement, {
                              context: ctx,
                              store: store,
                              setModuleReducers: function setModuleReducers(reducers) {
                                return moduleStoreReducer.set(store, reducers);
                              }
                            });
                            _context2.next = 9;
                            return contentLoaded();

                          case 9:
                            _renderApp(WrappedApp);
                            logger.success('rendered');

                          case 11:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function render() {
                    return _ref4.apply(this, arguments);
                  };
                }();

                _context3.next = 7;
                return render(App);

              case 7:
                return _context3.abrupt('return', render);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this);
      }));

      return function renderApp() {
        return _ref2.apply(this, arguments);
      };
    }()
  };
});
//# sourceMappingURL=browser.js.map