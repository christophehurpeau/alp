var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import React from 'react';
import { render } from 'react-dom';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import createAlpAppWrapper from './createAlpAppWrapper';
import createBrowserStore from './store/createBrowserStore';
import createBrowserModuleStoreReducer from './store/createBrowserModuleStoreReducer';
import { websocketMiddleware } from './websocket';
import createModuleVisitor from './module/createModuleVisitor';

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

var renderApp = function renderApp(App) {
  return render(React.createElement(App), document.getElementById('react-app'));
};

export default (function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(app, App) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        sharedReducers = _ref2.sharedReducers;

    var ctx, store, moduleStoreReducer, createStore, preRender, render, loggerWebsocket;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ctx = app.createContext();
            store = void 0;
            moduleStoreReducer = void 0;

            createStore = function createStore(ctx, moduleReducers) {
              moduleStoreReducer = createBrowserModuleStoreReducer(moduleReducers);
              var store = createBrowserStore(app, ctx, moduleStoreReducer.reducer, {
                sharedReducers: sharedReducers,
                middlewares: [app.websocket && websocketMiddleware(app)].filter(Boolean)
              });
              app.store = store;
              return store;
            };

            preRender = function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(app) {
                var moduleVisitor, preRenderStore, PreRenderWrappedApp;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        moduleVisitor = createModuleVisitor();
                        preRenderStore = { getState: function getState() {
                            return { ctx: ctx };
                          } };
                        PreRenderWrappedApp = createAlpAppWrapper(app, {
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
                return _ref3.apply(this, arguments);
              };
            }();

            render = function () {
              var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(App) {
                var app, moduleReducers, WrappedApp;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        app = React.createElement(App);
                        _context2.next = 3;
                        return preRender(app);

                      case 3:
                        moduleReducers = _context2.sent;

                        // in DEV
                        // eslint-disable-next-line no-lonely-if
                        if (!store) {
                          store = createStore(ctx, moduleReducers);
                        } else {
                          moduleStoreReducer.setReducers(moduleReducers);
                        }
                        WrappedApp = createAlpAppWrapper(app, {
                          context: ctx,
                          store: store,
                          setModuleReducers: function setModuleReducers(reducers) {
                            return moduleStoreReducer.set(store, reducers);
                          }
                        });


                        renderApp(WrappedApp);
                        logger.success('rendered');

                      case 8:
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

            if (app.websocket) {
              loggerWebsocket = logger.child('websocket');

              loggerWebsocket.debug('register websocket redux:action');
              app.websocket.on('redux:action', function (action) {
                loggerWebsocket.debug('dispatch action from websocket', action);
                if (store) {
                  store.dispatch(action);
                }
              });
            }

            _context3.next = 9;
            return render(App);

          case 9:
            return _context3.abrupt('return', render);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=browser.js.map