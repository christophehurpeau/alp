import { Logger } from 'nightingale-logger';
import semver from 'semver';
import { readdir, stat } from 'fs/promises';

async function readRecursiveDirectory(directory, callback) {
  const files = await readdir(directory);
  await Promise.all(files.map(async file => {
    const path = `${directory}/${file}`;
    const stat$1 = await stat(path);
    if (stat$1?.isDirectory()) {
      await readRecursiveDirectory(path, callback);
      return;
    }
    await callback({
      filename: file,
      basedir: directory,
      path,
      stat: stat$1
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
    }).then(row => row?.version);
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
    const fileName = res.path.slice(dirname.length + 1);
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
    for (const migration of migrations) {
      logger.info(`Migration to ${migration.fileName}`);
      try {
        const migrateFn = await import(`${dirname}/${migration.fileName}`);
        await migrateFn();
      } catch (err) {
        logger.error(`Migration to ${migration.version} Failed !`);
        throw err;
      }
      logger.success(`Migration to ${migration.fileName} done !`);

      // only add to db if migration version <= package version
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

export { MigrationsManager, migrate as default };
//# sourceMappingURL=index-node16.mjs.map
