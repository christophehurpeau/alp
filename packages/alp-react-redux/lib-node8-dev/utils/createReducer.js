'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReducer;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PRODUCTION */

function createReducer(defaultState, handlers) {
  let _defaultStateType = _flowRuntime2.default.union(_flowRuntime2.default.function(), _flowRuntime2.default.object());

  let _handlersType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

  _flowRuntime2.default.param('defaultState', _defaultStateType).assert(defaultState), _flowRuntime2.default.param('handlers', _handlersType).assert(handlers), typeof defaultState === 'object' && (handlers = _handlersType.assert(defaultState), defaultState = _defaultStateType.assert(() => null));


  const handlerMap = new Map();


  return Object.keys(handlers).forEach(key => {
    if (typeof key === 'function') {
      if (typeof key.type !== 'string') throw new Error(`Invalid handler key: "${key.name}"`);
      handlerMap.set(key.type, handlers[key]);
    } else handlerMap.set(key, handlers[key]);
  }), handlers = _handlersType.assert(void 0), (state = defaultState(), action) => action && handlerMap.has(action.type) ? handlerMap.get(action.type)(state, action) : state;
}
//# sourceMappingURL=createReducer.js.map