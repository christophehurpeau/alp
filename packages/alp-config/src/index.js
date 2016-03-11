import argv from 'minimist-argv';
import deepFreeze from 'deep-freeze-es6';
import parseJSON from 'parse-json-object-as-map';
import { existsSync, readFileSync } from 'fs';

function existsConfig(dirname, name) {
    return existsSync(`${dirname}${name}.json`);
}

function loadConfig(dirname, name) {
    let content = readFileSync(`${dirname}${name}.json`);
    return parseJSON(content);
}

export default function alpConfig(dirname, options = {}) {
    dirname = dirname.replace(/\/*$/, '/');

    options = Object.assign({}, options, {
        argv: [],
    });

    return app => {
        app.existsConfig = (name) => existsConfig(dirname, name);
        app.loadConfig = (name) => loadConfig(dirname, name);

        const config = loadConfig(dirname, 'common');
        for (let [key, value] of loadConfig(dirname, app.env)) {
            config.set(key, value);
        }

        if (existsConfig(dirname, 'local')) {
            for (let [key, value] of loadConfig(dirname, 'local')) {
                config.set(key, value);
            }
        }

        if (!config.has('version')) {
            config.set('version', argv.version || options.packageConfig.version);
        }

        let socketPath = argv['socket-path'] || argv.socketPath;
        if (socketPath) {
            config.set('socketPath', socketPath);
        } else if (argv.port) {
            config.set('port', argv.port);
            config.delete('socketPath');
        }

        options.argv.forEach(key => {
            if (argv[key] !== undefined) {
                config.set(key, argv[key]);
            }
        });

        app.config = config;
        app.context.config = config;
        app.context.production = !!config.get('production');

        return deepFreeze(config);
    };
}
