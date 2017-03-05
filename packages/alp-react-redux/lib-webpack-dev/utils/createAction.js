var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import t from 'flow-runtime';
/* global PRODUCTION */

export default function createAction(type, argsNamesOrHandler, data) {
  var _typeType = t.string();

  var _argsNamesOrHandlerType = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  var _dataType = t.nullable(t.object());

  t.param('type', _typeType).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);
  t.param('data', _dataType).assert(data);

  if (argsNamesOrHandler && typeof argsNamesOrHandler !== 'function') {
    throw new Error('handler should be a function');
  }
  if (data) throw new Error('data is deprecated');


  var action = void 0;

  var typeofSecondArg = typeof argsNamesOrHandler === 'undefined' ? 'undefined' : _typeof(argsNamesOrHandler);

  if (typeofSecondArg === 'function') {
    action = function action() {
      return Object.assign({ type: type }, data, argsNamesOrHandler.apply(undefined, arguments));
    };
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = _argsNamesOrHandlerType.assert(argsNamesOrHandler.split(','));
    }

    if (argsNamesOrHandler) {
      action = function action() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var action = Object.assign({ type: type }, data);
        args.forEach(function (value, index) {
          return action[argsNamesOrHandler[index]] = value;
        });
        return action;
      };
    } else {
      action = function action(args) {
        var _argsType = t.nullable(t.object());

        t.param('args', _argsType).assert(args);
        return Object.assign({ type: type }, data, args);
      };
    }
  }

  action.type = type;
  action.toString = function () {
    return type;
  };

  return action;
}
//# sourceMappingURL=createAction.js.map