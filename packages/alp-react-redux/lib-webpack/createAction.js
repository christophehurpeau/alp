var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* global PRODUCTION */

export default function createAction(type, argsNamesOrHandler, data) {

  var action = undefined;

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
//# sourceMappingURL=createAction.js.map