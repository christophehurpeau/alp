/* global fetch */
import * as storedConfig from './browserStoredConfig';
import parseJSON from 'parse-json-object-as-map';

function fetchConfig(path) {
    return fetch(`${ path }.json`).then(res => {
        return res.text();
    }).then(text => {
        return parseJSON(text);
    }).catch(() => {
        return false;
    });
}

/**
 * @param {string} path
 * @returns {Promise|Map}
 */
function getConfig(path) {
    if (storedConfig.has(path)) {
        return storedConfig.get(path);
    }
    return fetchConfig(path);
}

/**
 * @param {string} path
 * @returns {Promise|Boolean}
 */
function existsConfig(path) {
    if (storedConfig.has(path)) {
        return storedConfig.get(path) !== false;
    }
    return fetchConfig(path);
}

var getOrFetchAppConfig = function getOrFetchAppConfig(version, environment, configPath) {
    if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
        return Promise.resolve(storedConfig.get('_appConfig'));
    }

    storedConfig.clear(version);

    return Promise.all([getConfig(`${ configPath }common`), environment && getConfig(`${ configPath }environment`), getConfig(`${ configPath }local`)]).then(([config, ...others]) => {
        if (!config) config = new Map();

        others.filter(Boolean).forEach(jsonConfig => {
            jsonConfig.forEach((value, key) => {
                return config.set(key, value);
            });
        });

        storedConfig.set('_appConfig', config);

        return config;
    });
};

export default function alpConfig(configPath) {
    configPath = configPath.replace(/\/*$/, '/');
    return function (app) {
        app.existsConfig = name => {
            return existsConfig(`${ configPath }${ name }`);
        };
        app.loadConfig = name => {
            return getConfig(`${ configPath }${ name }`);
        };

        var version = app.appVersion;

        if (!version) {
            throw new Error('Missing appVersion');
        }

        return getOrFetchAppConfig(version, app.environment, configPath).then(config => {
            app.config = config;
            app.context.config = config;
            app.context.production = !!config.get('production');
            return config;
        });
    };
}
//# sourceMappingURL=browser.js.map