/* eslint-disable unicorn/no-process-exit */
import type { NodeApplication, NodeConfig } from 'alp-types';
import Logger from 'nightingale-logger';
import semver from 'semver';
import type MigrationsManager from './Manager';
import type { CallbackParam } from './readRecursiveDirectory';
import readRecursiveDirectory from './readRecursiveDirectory';

const logger = new Logger('alp:migrations');

export { default as MigrationsManager } from './Manager';

export interface Options {
  app: NodeApplication;
  migrationsManager: MigrationsManager;
  config?: NodeConfig;
  dirname?: string;
}

export default async function migrate({
  app,
  migrationsManager,
  config = app.config,
  dirname = `${app.dirname}/migrations`,
}: Options) {
  const unhandledRejectionHandler = (reason: any) => {
    logger.error('unhandledRejection', { err: reason });
    process.exit(1);
  };
  process.on('unhandledRejection', unhandledRejectionHandler);

  const packageVersion = config.packageConfig.version;
  const currentVersion = await migrationsManager.findLastVersion();

  let migrations: { version: string; fileName: string }[] = [];

  logger.info('migrate', { packageVersion, currentVersion });

  await readRecursiveDirectory(dirname, (res: CallbackParam) => {
    const fileName = res.path.slice(dirname.length + 1);

    if (!fileName.endsWith('.js')) {
      return;
    }

    const versionExecResult = /([\d.]+)(_.*|\.js)$/.exec(fileName);

    if (!versionExecResult || !versionExecResult[1]) {
      return;
    }

    const version: string = versionExecResult[1];

    if (currentVersion && semver.lte(version, currentVersion)) return;

    migrations.push({ version, fileName });
  });

  migrations = migrations.sort((a, b) =>
    semver.gt(a.version, b.version) ? 1 : -1,
  );

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
