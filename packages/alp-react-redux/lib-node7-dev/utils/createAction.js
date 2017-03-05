'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAction;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PRODUCTION */

function createAction(type, argsNamesOrHandler, data) {
  let _typeType = _flowRuntime2.default.string();

  let _argsNamesOrHandlerType = _flowRuntime2.default.union(_flowRuntime2.default.nullable(_flowRuntime2.default.array(_flowRuntime2.default.string())), _flowRuntime2.default.string(), _flowRuntime2.default.function());

  let _dataType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

  _flowRuntime2.default.param('type', _typeType).assert(type);

  _flowRuntime2.default.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  _flowRuntime2.default.param('data', _dataType).assert(data);

  if (argsNamesOrHandler && typeof argsNamesOrHandler !== 'function') {
    throw new Error('handler should be a function');
  }
  if (data) throw new Error('data is deprecated');


  let action;

  const typeofSecondArg = typeof argsNamesOrHandler;

  if (typeofSecondArg === 'function') {
    action = (...args) => Object.assign({ type }, data, argsNamesOrHandler(...args));
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = _argsNamesOrHandlerType.assert(argsNamesOrHandler.split(','));
    }

    if (argsNamesOrHandler) {
      action = (...args) => {
        const action = Object.assign({ type }, data);
        args.forEach((value, index) => action[argsNamesOrHandler[index]] = value);
        return action;
      };
    } else {
      action = args => {
        let _argsType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

        _flowRuntime2.default.param('args', _argsType).assert(args);

        return Object.assign({ type }, data, args);
      };
    }
  }

  action.type = type;
  action.toString = () => type;

  return action;
}
//# sourceMappingURL=createAction.js.map