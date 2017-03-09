/* global PRODUCTION */

export default function createAction(type, argsNamesOrHandler, data) {

  let action;

  const typeofSecondArg = typeof argsNamesOrHandler;

  if (typeofSecondArg === 'function') {
    action = function action(...args) {
      return Object.assign({ type }, data, argsNamesOrHandler(...args));
    };
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = argsNamesOrHandler.split(',');
    }

    if (argsNamesOrHandler) {
      action = function action(...args) {
        const action = Object.assign({ type }, data);
        args.forEach(function (value, index) {
          return action[argsNamesOrHandler[index]] = value;
        });
        return action;
      };
    } else {
      action = function action(args) {
        return Object.assign({ type }, data, args);
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