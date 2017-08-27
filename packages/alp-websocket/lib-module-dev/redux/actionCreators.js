import createAction from 'alp-react-redux';

import t from 'flow-runtime';
var ArgsNamesOfHandlerType = t.type('ArgsNamesOfHandlerType', t.union(t.array(t.string()), t.string(), t.function()));


export function createEmitAction(type, argsNamesOrHandler) {
  var _typeType = t.string();

  var _argsNamesOrHandlerType = t.nullable(ArgsNamesOfHandlerType);

  t.param('type', _typeType).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  var _typeType2 = t.string();

  var _argsNamesOrHandlerType2 = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  t.param('type', _typeType2).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
//# sourceMappingURL=actionCreators.js.map