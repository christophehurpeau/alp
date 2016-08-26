'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MigrationsManager = undefined;

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _readRecursiveDirectory = require('./readRecursiveDirectory');

var _readRecursiveDirectory2 = _interopRequireDefault(_readRecursiveDirectory);

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const logger = new _nightingaleLogger2.default('alp.migrations');

exports.MigrationsManager = _Manager2.default;

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (_ref2) {
    let config = _ref2.config;
    let dirname = _ref2.dirname;
    let migrationsManager = _ref2.migrationsManager;

    const unhandledRejectionHandler = function unhandledRejectionHandler(err) {
      logger.error('unhandledRejection', { err });
      process.exit(1);
    };
    process.on('unhandledRejection', unhandledRejectionHandler);

    const packageVersion = config.packageConfig.version;
    let currentVersion = yield migrationsManager.findLastVersion();
    let migrations = [];

    logger.info('migrate', { packageVersion, currentVersion });

    yield (0, _readRecursiveDirectory2.default)(dirname, function (res) {
      let fileName = res.path.substr(dirname.length + 1);

      if (fileName.slice(-3) !== '.js') {
        return;
      }

      let version = /([\d\.]+)(_.*|\.js)$/.exec(fileName);

      if (!version || !version[1]) {
        return;
      }

      version = version[1];

      if (currentVersion && _semver2.default.lte(version, currentVersion)) return;
      if (_semver2.default.gt(version, packageVersion)) return;

      migrations.push({ version: version, fileName: fileName });
    });

    migrations = migrations.sort(function (a, b) {
      return _semver2.default.gt(a.version, b.version);
    });

    try {
      if (!(migrations && (typeof migrations[Symbol.iterator] === 'function' || Array.isArray(migrations)))) {
        throw new TypeError('Expected migrations to be iterable, got ' + _inspect(migrations));
      }

      for (let migration of migrations) {
        logger.info(`Migration to ${ migration.fileName }`);
        try {
          // eslint-disable-next-line global-require
          yield require(`${ dirname }/${ migration.fileName }`).default();
        } catch (err) {
          logger.error(`Migration to ${ migration.version } Failed !`);
          throw err;
        }

        logger.success(`Migration to ${ migration.fileName } done !`);
        yield migrationsManager.addMigrationDone(migration);
      }
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }

    process.removeListener('unhandledRejection', unhandledRejectionHandler);
  });

  function migrate(_x) {
    return _ref.apply(this, arguments);
  }

  return migrate;
})();

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
//# sourceMappingURL=index.js.map