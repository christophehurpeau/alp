'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAction;
/* global PRODUCTION */

function createAction(type, argsNamesOrHandler, data) {

  let action;

  const typeofSecondArg = typeof argsNamesOrHandler;

  if (typeofSecondArg === 'function') {
    action = (...args) => Object.assign({ type }, data, argsNamesOrHandler(...args));
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = argsNamesOrHandler.split(',');
    }

    if (argsNamesOrHandler) {
      action = (...args) => {
        const action = Object.assign({ type }, data);
        args.forEach((value, index) => action[argsNamesOrHandler[index]] = value);
        return action;
      };
    } else {
      action = args => Object.assign({ type }, data, args);
    }
  }

  action.type = type;
  action.toString = () => type;

  return action;
}
//# sourceMappingURL=createAction.js.map