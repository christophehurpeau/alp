import Logger from 'nightingale-logger/src';

const logger = new Logger('alp-websocket:middleware');

export default app => store => next => action => {
  if (!action.meta || !action.meta.websocket) {
    return next(action);
  }

  if (!action.meta.promise) {
    app.websocket.emit(action.type, action);
    return;
  }

  const resolved = setTimeout(() => {
    logger.warn('websocket emit timeout', { action });
    // eslint-disable-next-line no-console
    console.log('alp.react-redux websocket emit timeout', action);
  }, 10000);

  app.websocket.emit(action.type, action, action => {
    clearTimeout(resolved);
    if (action) {
      store.dispatch(action);
    }
  });
};
