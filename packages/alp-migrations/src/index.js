import semver from 'semver';
import Logger from 'nightingale-logger';
import readRecursiveDirectory from './readRecursiveDirectory';

const logger = new Logger('alp.migrations');

export MigrationsManager from './Manager';

export default async function migrate({ config, dirname, migrationsManager }) {
    const unhandledRejectionHandler = (err) => {
        logger.error('unhandledRejection', { err });
        process.exit(1);
    };
    process.on('unhandledRejection', unhandledRejectionHandler);

    const packageVersion = config.packageConfig.version;
    let currentVersion = await migrationsManager.findLastVersion();
    let migrations = [];

    logger.info('migrate', { packageVersion, currentVersion });

    await readRecursiveDirectory(dirname, (res) => {
        let fileName = res.path.substr(dirname.length + 1);

        if (fileName.slice(-3) !== '.js') {
            return;
        }

        let version = /([\d\.]+)(_.*|\.js)$/.exec(fileName);

        if (!version || !version[1]) {
            return;
        }

        version = version[1];

        if ((currentVersion && semver.lte(version, currentVersion)) || semver.gt(version, packageVersion)) {
            return;
        }

        migrations.push({ version: version, fileName: fileName });
    });

    migrations = migrations.sort((a, b) => semver.gt(a.version, b.version));

    try {
        for (let migration of migrations) {
            // logger.info('Migration to ' + migration.fileName);
            console.log(`Migration to ${migration.version}`);
            try {
                // eslint-disable-next-line global-require
                await require(`${dirname}/${migration.fileName}`).default();
            } catch (err) {
                // logger.error('Migration to ' + migration.version + ' Failed !');
                console.log(`Migration to ${migration.version} Failed !`);
                throw err;
            }

            // logger.success('Migration to ' + migration.fileName + ' done !');
            console.log(`Migration to ${migration.fileName} done !`);
            await migrationsManager.addMigrationDone(migration);
        }
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }

    process.removeListener('unhandledRejection', unhandledRejectionHandler);
}
