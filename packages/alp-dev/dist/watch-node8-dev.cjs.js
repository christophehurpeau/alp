'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var fs__default = _interopDefault(fs);
var path = require('path');
var path__default = _interopDefault(path);
var mkdirp = _interopDefault(require('mkdirp'));
var jsYaml = require('js-yaml');
var glob = _interopDefault(require('glob'));
var child_process = require('child_process');
var portscanner = _interopDefault(require('portscanner'));
var argv = _interopDefault(require('minimist-argv'));
var createChild = _interopDefault(require('springbokjs-daemon'));

var readFile = (target => new Promise((resolve, reject) => {
  fs__default.readFile(target, (err, content) => {
    if (err) {
      return reject(new Error(`Failed to read file "${target}": ${err.message || err}`));
    }

    resolve(content);
  });
}));

var writeFile = ((target, content) => new Promise((resolve, reject) => {
  mkdirp(path__default.dirname(target), () => {
    fs__default.writeFile(target, content, err => {
      if (err) {
        return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
      }

      resolve();
    });
  });
}));

function loadConfigFile(content, dirname) {
  const data = jsYaml.safeLoad(content) || {};

  const config = data.shared || data.common || {};
  const serverConfig = Object.assign({}, config, data.server);
  const browserConfig = Object.assign({}, config, data.browser);

  if (data.include) {
    const includePaths = data.include.map(includePath => path__default.resolve(dirname, includePath));
    includePaths.map(includePath => fs.readFileSync(includePath)).map((content, index) => loadConfigFile(content, path__default.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
      [{ config: serverConfig, include: includeServerConfig }, { config: browserConfig, include: includeBrowserConfig }].forEach(({ config, include }) => Object.keys(include).forEach(key => {
        if (!(key in config)) {
          config[key] = include[key];
          return;
        }
        if (Array.isArray(config[key])) {
          config[key].push(include[key]);
        } else if (typeof config[key] === 'object') {
          Object.assign(config[key], include[key]);
        } else {
          throw new Error(`Unexpected override "${key}", filename = ${includePaths[key]}`);
        }
      }));
    });
  }

  return [serverConfig, browserConfig];
}

const build = (src = './src/config') => Promise.all(glob.sync(path.join(src, '**/*.yml')).map(filename => readFile(filename).then(content => {
  const [serverConfig, browserConfig] = loadConfigFile(content, path.dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;

  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
})));

/* eslint-disable global-require */

const startProxyPort = argv.browserSyncStartPort || 3000;
const startAppPort = argv.startAppPort || 3050;

child_process.execSync(`rm -Rf ${path__default.resolve('public')}/* ${path__default.resolve('build')}/*`);

Promise.all([portscanner.findAPortNotInUse(startProxyPort, startProxyPort + 49), portscanner.findAPortNotInUse(startAppPort, startAppPort + 49), build()]).then(([proxyPort, port]) => {
  if (proxyPort === port) {
    throw new Error(`"proxyPort" and "port" cannot have the same value: ${port}`);
  }

  createChild({
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-node-')), '--port', port]
  }).start();

  createChild({
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-browser-')), '--port', port, '--proxy-port', proxyPort, '--host', argv.host || '']
  }).start();
}).catch(err => console.log(err.stack));
//# sourceMappingURL=watch-node8-dev.cjs.js.map
