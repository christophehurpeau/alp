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

process.on('unhandledRejection', err => {
    logger.error('unhandledRejection', { err });
    process.exit(1);
});

exports.MigrationsManager = _Manager2.default;

exports.default = (() => {
    var ref = _asyncToGenerator(function* (_ref) {
        let config = _ref.config;
        let dirname = _ref.dirname;
        let migrationsManager = _ref.migrationsManager;

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

            if (currentVersion && _semver2.default.lte(version, currentVersion) || _semver2.default.gt(version, packageVersion)) {
                return;
            }

            migrations.push({ version: version, fileName: fileName });
        });

        migrations = migrations.sort(function (a, b) {
            return _semver2.default.gt(a.version, b.version);
        });

        try {
            for (let migration of migrations) {
                // logger.info('Migration to ' + migration.fileName);
                console.log(`Migration to ${ migration.version }`);
                try {
                    // eslint-disable-next-line global-require
                    yield require(`${ dirname }/${ migration.fileName }`).default();
                } catch (err) {
                    // logger.error('Migration to ' + migration.version + ' Failed !');
                    console.log(`Migration to ${ migration.version } Failed !`);
                    throw err;
                }

                // logger.success('Migration to ' + migration.fileName + ' done !');
                console.log(`Migration to ${ migration.fileName } done !`);
                yield migrationsManager.addMigrationDone(migration);
            }
        } catch (err) {
            logger.error(err);
            process.exit(1);
        }
    });

    function migrate(_x) {
        return ref.apply(this, arguments);
    }

    return migrate;
})();
//# sourceMappingURL=index.js.map