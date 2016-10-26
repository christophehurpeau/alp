var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global PRODUCTION */

export default function createAction(type, argsNamesOrHandler, data) {

  var action = void 0;

  var typeofSecondArg = typeof argsNamesOrHandler;

  if (typeofSecondArg === 'function') {
    action = function action() {
      return _extends({ type }, data, argsNamesOrHandler(...arguments));
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

        var action = _extends({ type }, data);
        args.forEach((value, index) => action[argsNamesOrHandler[index]] = value);
        return action;
      };
    } else {
      action = args => _extends({ type }, data, args);
    }
  }

  action.type = type;
  action.toString = () => type;

  return action;
}
//# sourceMappingURL=createAction.js.map