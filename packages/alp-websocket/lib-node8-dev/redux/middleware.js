'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp-websocket:middleware');

exports.default = function middleware(app) {
  return store => next => action => {
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
};
//# sourceMappingURL=middleware.js.map