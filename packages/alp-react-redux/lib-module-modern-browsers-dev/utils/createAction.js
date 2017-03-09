import t from 'flow-runtime';
/* global PRODUCTION */

export default function createAction(type, argsNamesOrHandler, data) {
  let _typeType = t.string();

  let _argsNamesOrHandlerType = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  let _dataType = t.nullable(t.object());

  t.param('type', _typeType).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);
  t.param('data', _dataType).assert(data);

  if (argsNamesOrHandler && typeof argsNamesOrHandler !== 'function') {
    throw new Error('handler should be a function');
  }
  if (data) throw new Error('data is deprecated');


  let action;

  const typeofSecondArg = typeof argsNamesOrHandler;

  if (typeofSecondArg === 'function') {
    action = function action(...args) {
      return Object.assign({ type }, data, argsNamesOrHandler(...args));
    };
  } else {
    if (typeofSecondArg === 'string') {
      argsNamesOrHandler = _argsNamesOrHandlerType.assert(argsNamesOrHandler.split(','));
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
        let _argsType = t.nullable(t.object());

        t.param('args', _argsType).assert(args);
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