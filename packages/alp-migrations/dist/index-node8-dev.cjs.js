'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const semver = _interopDefault(require('semver'));
const Logger = _interopDefault(require('nightingale-logger'));
const fs = require('fs');

function readRecursiveDirectory(directory, callback) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (errReadDir, files) => {
      if (errReadDir) return reject(errReadDir);
      Promise.all(files.map(file => {
        const path = `${directory}/${file}`;
        return new Promise((resolve, reject) => {
          fs.stat(path, (errFsStat, stat) => {
            if (errFsStat) return reject(errFsStat);

            if (stat && stat.isDirectory()) {
              readRecursiveDirectory(path, callback).then(resolve).catch(reject);
              return;
            }

            try {
              Promise.resolve(callback({
                filename: file,
                basedir: directory,
                path,
                stat
              })).then(() => resolve()).catch(reject);
            } catch (err) {
              return reject(err);
            }
          });
        });
      })).then(() => resolve());
    });
  });
}

class MigrationsManager {
  constructor(store) {
    this.store = store;
  }

  findLastVersion() {
    return this.store.findOne({}, {
      created: -1
    }).then(row => row && row.version);
  }

  addMigrationDone(migration) {
    return this.store.insertOne(migration);
  }

}

/* eslint-disable unicorn/no-process-exit */
const logger = new Logger('alp:migrations');
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
    const fileName = res.path.substr(dirname.length + 1);

    if (!fileName.endsWith('.js')) {
      return;
    }

    const versionExecResult = /([\d.]+)(_.*|\.js)$/.exec(fileName);

    if (!versionExecResult || !versionExecResult[1]) {
      return;
    }

    const version = versionExecResult[1];
    if (currentVersion && semver.lte(version, currentVersion)) return;
    migrations.push({
      version,
      fileName
    });
  });
  migrations = migrations.sort((a, b) => semver.gt(a.version, b.version) ? 1 : -1);

  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const migration of migrations) {
      logger.info(`Migration to ${migration.fileName}`);

      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require, no-await-in-loop
        await require(`${dirname}/${migration.fileName}`).default();
      } catch (err) {
        logger.error(`Migration to ${migration.version} Failed !`);
        throw err;
      }

      logger.success(`Migration to ${migration.fileName} done !`); // only add to db if migration version <= package version

      if (semver.lte(migration.version, packageVersion)) {
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
//# sourceMappingURL=index-node8-dev.cjs.js.map
