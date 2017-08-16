var _this = this;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) !(keys.indexOf(i) >= 0) && Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]); return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import reactTreeWalker from 'react-tree-walker';
import Logger from 'nightingale-logger';
import isModernBrowser from 'modern-browsers';
import htmlLayout from './layout/htmlLayout';
import createAlpAppWrapper from './createAlpAppWrapper';
import createServerStore from './store/createServerStore';
import createModuleVisitor from './module/createModuleVisitor';

import t from 'flow-runtime';
export { Helmet };
export { combineReducers } from 'redux';
export { connect } from 'react-redux';
export { createAction, createReducer, createLoader, classNames, createPureStatelessComponent, identityReducer } from './utils/index';
import _AlpModule from './module/AlpModule';
export { _AlpModule as AlpModule };
import _AlpReduxModule from './module/AlpReduxModuleServer';
export { _AlpReduxModule as AlpReduxModule };
import _Body from './layout/Body';
export { _Body as Body };
import _AppContainer from './layout/AppContainer';
export { _AppContainer as AppContainer };


var logger = new Logger('alp:react-redux');

var renderHtml = function renderHtml(app, options) {
  var content = renderToString(app);
  var helmet = Helmet.renderStatic();
  return htmlLayout(helmet, content, options);
};

var OptionsType = t.type('OptionsType', t.exactObject(t.property('sharedReducers', t.nullable(t.object(t.indexer('key', t.string(), t.any())))), t.property('scriptName', t.union(t.nullable(t.string()), t.boolean(false))), t.property('styleName', t.union(t.nullable(t.string()), t.boolean(false))), t.property('polyfillFeatures', t.nullable(t.string()))));


export default (function index(App) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};

  var _optionsType = t.nullable(OptionsType);

  return t.param('options', _optionsType).assert(options), function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
      var version, ua, name, app, moduleVisitor, preRenderStore, PreRenderWrappedApp, store, WrappedApp, _store$getState, removeCtxFromInitialData, initialData;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        for (;;) switch (_context.prev = _context.next) {
          case 0:
            return version = t.string().assert(ctx.config.get('version')), ua = ctx.req.headers['user-agent'], name = isModernBrowser(ua) ? 'modern-browsers' : 'es5', app = React.createElement(App), moduleVisitor = createModuleVisitor(), preRenderStore = { getState: function getState() {
                return { ctx: ctx };
              } }, PreRenderWrappedApp = createAlpAppWrapper(app, { context: ctx, store: preRenderStore }), _context.next = 9, reactTreeWalker(React.createElement(PreRenderWrappedApp), moduleVisitor.visitor);

          case 9:
            return store = createServerStore(ctx, moduleVisitor.getReducers(), {
              sharedReducers: options.sharedReducers
            }), WrappedApp = createAlpAppWrapper(app, { context: ctx, store: store }), _store$getState = store.getState(), removeCtxFromInitialData = _store$getState.ctx, initialData = _objectWithoutProperties(_store$getState, ['ctx']), _context.next = 14, renderHtml(React.createElement(WrappedApp), {
              version: version,
              scriptName: options.scriptName === void 0 ? name : options.scriptName,
              styleName: options.styleName === void 0 ? name : options.styleName,
              polyfillFeatures: options.polyfillFeatures,
              initialData: initialData
            });

          case 14:
            ctx.body = _context.sent;

          case 15:
          case 'end':
            return _context.stop();
        }
      }, _callee, _this);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();
});

var loggerWebsocket = logger.child('websocket');

export function emitAction(to, action) {
  loggerWebsocket.debug('emitAction', action), to.emit('redux:action', action);
}
//# sourceMappingURL=index.js.map