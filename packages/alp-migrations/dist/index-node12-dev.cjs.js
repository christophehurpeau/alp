'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Logger = require('nightingale-logger');
const semver = require('semver');
const promises = require('fs/promises');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
const semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);

async function readRecursiveDirectory(directory, callback) {
  const files = await promises.readdir(directory);
  await Promise.all(files.map(async file => {
    const path = `${directory}/${file}`;
    const stat = await promises.stat(path);

    if (stat !== null && stat !== void 0 && stat.isDirectory()) {
      await readRecursiveDirectory(path, callback);
      return;
    }

    await callback({
      filename: file,
      basedir: directory,
      path,
      stat
    });
  }));
}

class MigrationsManager {
  constructor(store) {
    this.store = store;
  }

  findLastVersion() {
    return this.store.findOne({}, {
      created: -1
    }).then(row => row === null || row === void 0 ? void 0 : row.version);
  }

  addMigrationDone(migration) {
    return this.store.insertOne(migration);
  }

}

/* eslint-disable unicorn/no-process-exit */
const logger = new Logger__default('alp:migrations');
async function migrate({
  app,
  migrationsManager,
  config = app.config,
  dirname = `${app.dirname}/migrations`
}) {
  const unhandledRejectionHandler = reason => {
    logger.error('unhandledRejection', {
      err: reason
    });
    process.exit(1);
  };

  process.on('unhandledRejection', unhandledRejectionHandler);
  const packageVersion = config.packageConfig.version;
  const currentVersion = await migrationsManager.findLastVersion();
  let migrations = [];
  logger.info('migrate', {
    packageVersion,
    currentVersion
  });
  await readRecursiveDirectory(dirname, res => {
    const fileName = res.path.slice(dirname.length + 1);

    if (!fileName.endsWith('.js')) {
      return;
    }

    const versionExecResult = /([\d.]+)(_.*|\.js)$/.exec(fileName);

    if (!versionExecResult || !versionExecResult[1]) {
      return;
    }

    const version = versionExecResult[1];
    if (currentVersion && semver__default.lte(version, currentVersion)) return;
    migrations.push({
      version,
      fileName
    });
  });
  migrations = migrations.sort((a, b) => semver__default.gt(a.version, b.version) ? 1 : -1);

  try {
    for (const migration of migrations) {
      logger.info(`Migration to ${migration.fileName}`);

      try {
        // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
        await require(`${dirname}/${migration.fileName}`).default();
      } catch (err) {
        logger.error(`Migration to ${migration.version} Failed !`);
        throw err;
      }

      logger.success(`Migration to ${migration.fileName} done !`); // only add to db if migration version <= package version

      if (semver__default.lte(migration.version, packageVersion)) {
        await migrationsManager.addMigrationDone(migration);
      }
    }
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  process.removeListener('unhandledRejection', unhandledRejectionHandler);
}

exports.MigrationsManager = MigrationsManager;
exports.default = migrate;
//# sourceMappingURL=index-node12-dev.cjs.js.map
