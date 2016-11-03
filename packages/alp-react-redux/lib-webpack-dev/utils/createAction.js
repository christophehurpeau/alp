var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import _t from 'tcomb-forked';
/* global PRODUCTION */

export default function createAction(type, argsNamesOrHandler, data) {
  _assert(type, _t.String, 'type');

  _assert(argsNamesOrHandler, _t.union([_t.maybe(_t.list(_t.String)), _t.String, _t.Function]), 'argsNamesOrHandler');

  _assert(data, _t.maybe(_t.Object), 'data');

  if (argsNamesOrHandler && typeof argsNamesOrHandler !== 'function') {
    throw new Error('handler should be a function');
  }
  if (data) throw new Error('data is deprecated');


  var action = void 0;

  var typeofSecondArg = typeof argsNamesOrHandler === 'undefined' ? 'undefined' : _typeof(argsNamesOrHandler);

  if (typeofSecondArg === 'function') {
    action = function action() {
      return _extends({ type: type }, data, argsNamesOrHandler.apply(undefined, arguments));
    };
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = argsNamesOrHandler.split(',');
    }

    if (argsNamesOrHandler) {
      action = function action() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var action = _extends({ type: type }, data);
        args.forEach(function (value, index) {
          return action[argsNamesOrHandler[index]] = value;
        });
        return action;
      };
    } else {
      action = function action(args) {
        _assert(args, _t.maybe(_t.Object), 'args');

        return _extends({ type: type }, data, args);
      };
    }
  }

  action.type = type;
  action.toString = function () {
    return type;
  };

  return action;
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=createAction.js.map