'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createAction;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PRODUCTION */

function createAction(type, argsNamesOrHandler, data) {
  _assert(type, _tcombForked2.default.String, 'type');

  _assert(argsNamesOrHandler, _tcombForked2.default.union([_tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.String)), _tcombForked2.default.String, _tcombForked2.default.Function]), 'argsNamesOrHandler');

  _assert(data, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'data');

  if (argsNamesOrHandler && typeof argsNamesOrHandler !== 'function') {
    throw new Error('handler should be a function');
  }
  if (data) throw new Error('data is deprecated');


  let action;

  const typeofSecondArg = typeof argsNamesOrHandler;

  if (typeofSecondArg === 'function') {
    action = (...args) => _extends({ type }, data, argsNamesOrHandler(...args));
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = argsNamesOrHandler.split(',');
    }

    if (argsNamesOrHandler) {
      action = (...args) => {
        const action = _extends({ type }, data);
        args.forEach((value, index) => action[argsNamesOrHandler[index]] = value);
        return action;
      };
    } else {
      action = args => {
        _assert(args, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'args');

        return _extends({ type }, data, args);
      };
    }
  }

  action.type = type;
  action.toString = () => type;

  return action;
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=createAction.js.map