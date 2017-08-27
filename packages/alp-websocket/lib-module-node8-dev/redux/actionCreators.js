/* eslint-disable */
import { createAction } from 'alp-react-redux';

import t from 'flow-runtime';
const ArgsNamesOfHandlerType = t.type('ArgsNamesOfHandlerType', t.union(t.array(t.string()), t.string(), t.function()));


export function createEmitAction(type, argsNamesOrHandler) {
  let _typeType = t.string();

  let _argsNamesOrHandlerType = t.nullable(ArgsNamesOfHandlerType);

  t.param('type', _typeType).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  let _typeType2 = t.string();

  let _argsNamesOrHandlerType2 = t.union(t.nullable(t.array(t.string())), t.string(), t.function());

  t.param('type', _typeType2).assert(type);
  t.param('argsNamesOrHandler', _argsNamesOrHandlerType2).assert(argsNamesOrHandler);

  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
//# sourceMappingURL=actionCreators.js.map