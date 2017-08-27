import createAction from 'alp-react-redux';

export function createEmitAction(type, argsNamesOrHandler) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true } });
}

export function createEmitPromiseAction(type, argsNamesOrHandler) {
  return createAction(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}
//# sourceMappingURL=actionCreators.js.map