/* global fetch */
import * as storedConfig from './browserStoredConfig';
import parseJSON from 'parse-json-object-as-map';

function fetchConfig(path) {
    return fetch(`${path}.json`)
        .then(res => res.text())
        .then(text => parseJSON(text))
        .catch(() => false);
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

const getOrFetchAppConfig = async function (version, environment, configPath) {
    if (storedConfig.getVersion() === version && storedConfig.has('_appConfig')) {
        return storedConfig.get('_appConfig');
    }

    storedConfig.clear(version);

    const jsonConfig = await Promise.all([
        getConfig(`${configPath}common`),
        environment && getConfig(`${configPath}environment`),
        getConfig(`${configPath}local`),
    ]);
    const config = jsonConfig[0] || new Map();
    jsonConfig.slice(1).filter(Boolean).forEach(jsonConfig => {
        for (let [key, value] of jsonConfig) {
            config.set(key, value);
        }
    });

    storedConfig.set('_appConfig', config);
    return config;
};

export default function alpConfig(configPath) {
    configPath = configPath.replace(/\/*$/, '/');
    return async function (app) {
        app.existsConfig = (name) => existsConfig(`${configPath}${name}`);
        app.loadConfig = (name) => getConfig(`${configPath}${name}`);

        const version = app.appVersion;

        if (!version) {
            throw new Error('Missing appVersion');
        }

        const config = await getOrFetchAppConfig(version, app.environment, configPath);
        app.config = config;
        app.context.config = config;
        app.context.production = !!config.get('production');
        return config;
    };
}
