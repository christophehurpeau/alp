'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketMiddleware = undefined;
exports.createEmitAction = createEmitAction;
exports.createEmitPromiseAction = createEmitPromiseAction;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _createAction = require('./createAction');

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp.react-redux.websocket');

function createEmitAction(type, argsNamesOrHandler) {
  if (!(typeof type === 'string')) {
    throw new TypeError('Value of argument "type" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(type));
  }

  if (!(argsNamesOrHandler == null || Array.isArray(argsNamesOrHandler) && argsNamesOrHandler.every(function (item) {
    return typeof item === 'string';
  }) || typeof argsNamesOrHandler === 'string' || typeof argsNamesOrHandler === 'function')) {
    throw new TypeError('Value of argument "argsNamesOrHandler" violates contract.\n\nExpected:\n?Array<string> | string | Function\n\nGot:\n' + _inspect(argsNamesOrHandler));
  }

  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true } });
}

function createEmitPromiseAction(type, argsNamesOrHandler) {
  if (!(typeof type === 'string')) {
    throw new TypeError('Value of argument "type" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(type));
  }

  if (!(argsNamesOrHandler == null || Array.isArray(argsNamesOrHandler) && argsNamesOrHandler.every(function (item) {
    return typeof item === 'string';
  }) || typeof argsNamesOrHandler === 'string' || typeof argsNamesOrHandler === 'function')) {
    throw new TypeError('Value of argument "argsNamesOrHandler" violates contract.\n\nExpected:\n?Array<string> | string | Function\n\nGot:\n' + _inspect(argsNamesOrHandler));
  }

  return (0, _createAction2.default)(type, argsNamesOrHandler, { meta: { websocket: true, promise: true } });
}

const websocketMiddleware = exports.websocketMiddleware = app => {
  return store => {
    return next => {
      return action => {
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
  };
};

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}
//# sourceMappingURL=websocket.js.map