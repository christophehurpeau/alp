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

const logger = new _nightingaleLogger2.default('alp:migrations');

exports.MigrationsManager = _Manager2.default;

exports.default = async function migrate({ app, config, dirname, migrationsManager }) {
  if (!config) config = app.config;
  if (!dirname) dirname = `${app.dirname}/migrations`;

  const unhandledRejectionHandler = err => {
    logger.error('unhandledRejection', { err });
    process.exit(1);
  };
  process.on('unhandledRejection', unhandledRejectionHandler);

  const packageVersion = config.packageConfig.version;
  let currentVersion = await migrationsManager.findLastVersion();
  let migrations = [];

  logger.info('migrate', { packageVersion, currentVersion });

  await (0, _readRecursiveDirectory2.default)(dirname, res => {
    let fileName = res.path.substr(dirname.length + 1);

    if (fileName.slice(-3) !== '.js') {
      return;
    }

    let version = /([\d.]+)(_.*|\.js)$/.exec(fileName);

    if (!version || !version[1]) {
      return;
    }

    version = version[1];

    if (currentVersion && _semver2.default.lte(version, currentVersion)) return;

    migrations.push({ version, fileName });
  });

  migrations = migrations.sort((a, b) => _semver2.default.gt(a.version, b.version));

  try {
    // eslint-disable-next-line no-restricted-syntax
    for (let migration of migrations) {
      logger.info(`Migration to ${migration.fileName}`);
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require, no-await-in-loop
        await require(`${dirname}/${migration.fileName}`).default();
      } catch (err) {
        logger.error(`Migration to ${migration.version} Failed !`);
        throw err;
      }

      logger.success(`Migration to ${migration.fileName} done !`);

      // only add to db if migration version <= package version
      if (_semver2.default.lte(migration.version, packageVersion)) {
        // eslint-disable-next-line no-await-in-loop
        await migrationsManager.addMigrationDone(migration);
      }
    }
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  process.removeListener('unhandledRejection', unhandledRejectionHandler);
};
//# sourceMappingURL=index.js.map