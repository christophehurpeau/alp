import createAction from 'alp-react-redux';

type ArgsNamesOfHandlerType = Array<string> | string | Function;

export function createEmitAction(type: string, argsNamesOrHandler: ?ArgsNamesOfHandlerType) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(
  type: string,
  argsNamesOrHandler: ?Array<string> | string | Function,
) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
