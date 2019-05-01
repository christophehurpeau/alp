'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const Logger = require('nightingale');
const Logger__default = _interopDefault(Logger);
const ConsoleLogger = _interopDefault(require('nightingale-console'));
const child_process = require('child_process');
const path = require('path');
const path__default = _interopDefault(path);
const portscanner = _interopDefault(require('portscanner'));
const argv = _interopDefault(require('minimist-argv'));
const createChild = _interopDefault(require('springbokjs-daemon'));
const fs = require('fs');
const fs__default = _interopDefault(fs);
const glob = _interopDefault(require('glob'));
const mkdirp = _interopDefault(require('mkdirp'));
const jsYaml = require('js-yaml');

Logger.addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger(Logger.Level.NOTICE),
  stop: true
}, true);
Logger.addConfig({
  pattern: /^alp-dev/,
  handler: new ConsoleLogger(Logger.Level.INFO),
  stop: true
}, true);

function readFile(target) {
  return new Promise((resolve, reject) => {
    fs__default.readFile(target, 'utf-8', (err, content) => {
      if (err) {
        return reject(new Error(`Failed to read file "${target}": ${err.message || err}`));
      }

      resolve(content);
    });
  });
}

function writeFile(target, content) {
  return new Promise((resolve, reject) => {
    mkdirp(path__default.dirname(target), () => {
      fs__default.writeFile(target, content, err => {
        if (err) {
          return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
        }

        resolve();
      });
    });
  });
}

function loadConfigFile(content, dirname) {
  const data = jsYaml.safeLoad(content) || {};
  const config = data.shared || data.common || {};
  const serverConfig = { ...config,
    ...data.server
  };
  const browserConfig = { ...config,
    ...data.browser
  };

  if (data.include) {
    const includePaths = data.include.map(includePath => path__default.resolve(dirname, includePath));
    includePaths.map(includePath => fs.readFileSync(includePath, 'utf-8')).map((content, index) => loadConfigFile(content, path__default.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
      [{
        config: serverConfig,
        include: includeServerConfig
      }, {
        config: browserConfig,
        include: includeBrowserConfig
      }].forEach(({
        config,
        include
      }) => Object.keys(include).forEach(key => {
        if (!(key in config)) {
          config[key] = include[key];
          return;
        }

        if (Array.isArray(config[key])) {
          config[key].push(include[key]);
        } else if (typeof config[key] === 'object') {
          Object.assign(config[key], include[key]);
        } else {
          throw new TypeError(`Unexpected override "${key}", filename = ${includePaths[key]}`);
        }
      }));
    });
  }

  return [serverConfig, browserConfig];
}

const compileYml = async filename => {
  const content = await readFile(filename);
  const [serverConfig, browserConfig] = loadConfigFile(content, path.dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob.sync(path.join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = fs.watch(filename, {
      persistent: false,
      recursive: false
    }, async eventType => {
      console.log(eventType, filename);

      if (eventType === 'change') {
        await compileYml(filename);
        onChanged();
      }
    });
    await compilePromise;
    return () => fsWatcher.close();
  }

  return () => {};
})).then(closeFns => () => {
  closeFns.forEach(closeFn => closeFn());
});

const startProxyPort = argv.browserSyncStartPort || 3000;
const startAppPort = argv.startAppPort || 3050;
const endProxyPort = startProxyPort + 49;
const endAppPort = startAppPort + 49;
const logger = new Logger__default('alp-dev:watch', 'alp-dev');
child_process.execSync(`rm -Rf ${path__default.resolve('public')}/* ${path__default.resolve('build')}/*`);
let nodeChild;
Promise.all([portscanner.findAPortNotInUse(startProxyPort, endProxyPort), portscanner.findAPortNotInUse(startAppPort, endAppPort), build('./src/config', () => {
  logger.warn('config changed, restarting server');
  if (nodeChild) nodeChild.sendSIGUSR2();
})]).then(([proxyPort, port]) => {
  if (proxyPort === port) {
    throw new Error(`"proxyPort" and "port" cannot have the same value: ${port}`);
  }

  nodeChild = createChild({
    key: 'alp-dev:watch:watch-node',
    displayName: 'alp-dev:watch-node',
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-node-')), '--port', port]
  });
  const browserChild = createChild({
    key: 'alp-dev:watch:watch-browser',
    displayName: 'alp-dev:watch-browser',
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-browser-')), '--port', port, '--proxy-port', proxyPort, '--host', argv.host || '']
  });
  Promise.all([nodeChild.start(), browserChild.start()]).then(() => {
    logger.success('ready', {
      port: proxyPort,
      serverPort: port
    });
  });
}).catch(err => console.log(err.stack));
//# sourceMappingURL=watch-node10.cjs.js.map
