'use strict';

const Logger = require('nightingale');
const ConsoleLogger = require('nightingale-console');
const child_process = require('child_process');
const path = require('path');
const colorette = require('colorette');
const argv = require('minimist-argv');
const formatterANSI = require('nightingale-ansi-formatter');
const portscanner = require('portscanner');
const ProgressBar = require('progress');
const createChild = require('springbokjs-daemon');
const fs = require('fs');
const glob = require('glob');
const jsYaml = require('js-yaml');
const mkdirp = require('mkdirp');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
const ConsoleLogger__default = /*#__PURE__*/_interopDefaultLegacy(ConsoleLogger);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const colorette__default = /*#__PURE__*/_interopDefaultLegacy(colorette);
const argv__default = /*#__PURE__*/_interopDefaultLegacy(argv);
const formatterANSI__default = /*#__PURE__*/_interopDefaultLegacy(formatterANSI);
const portscanner__default = /*#__PURE__*/_interopDefaultLegacy(portscanner);
const ProgressBar__default = /*#__PURE__*/_interopDefaultLegacy(ProgressBar);
const createChild__default = /*#__PURE__*/_interopDefaultLegacy(createChild);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
const mkdirp__default = /*#__PURE__*/_interopDefaultLegacy(mkdirp);

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
    mkdirp__default(path__default.dirname(target), () => {
      fs__default.writeFile(target, content, err => {
        if (err) {
          return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
        }

        resolve();
      });
    });
  });
}

const compileYml = async filename => {
  const content = await readFile(filename);
  const [serverConfig, browserConfig] = loadConfigFile(content, path.dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob__default.sync(path.join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = fs.watch(filename, {
      persistent: false,
      recursive: false
    }, eventType => {
      console.log(eventType, filename);

      if (eventType === 'change') {
        compileYml(filename).then(() => {
          onChanged();
        });
      }
    });
    await compilePromise;
    return () => fsWatcher.close();
  }

  return () => {};
})).then(closeFns => () => {
  closeFns.forEach(closeFn => closeFn());
});

const startProxyPort = argv__default.browserSyncStartPort || 3000;
const startAppPort = argv__default.startAppPort || 3050;
const endProxyPort = startProxyPort + 49;
const endAppPort = startAppPort + 49;
const logger = new Logger__default('alp-dev:watch', 'alp-dev');
child_process.execSync(`rm -Rf ${path__default.resolve('public')}/* ${path__default.resolve('build')}/*`);
let nodeChild;
const bar = new ProgressBar__default(`${colorette__default.bold(colorette__default.yellow('Building...'))} ${colorette__default.bold(':percent')} [:bar] → :msg`, {
  incomplete: ' ',
  complete: '▇',
  total: 100,
  width: 1024,
  // max width possible
  clear: true,
  stream: process.stdout
});

const output = param => {
  if (bar.complete) {
    process.stdout.write(`${param}\n`);
  } else {
    bar.interrupt(param);
  }
};

const formatterSimplified = ({
  key,
  datetime,
  ...restRecord
}) => formatterANSI__default(restRecord);

Logger.addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger__default(Logger.Level.NOTICE, {
    output
  }),
  stop: true
}, true);
Logger.addConfig({
  pattern: /^alp-dev/,
  handler: new ConsoleLogger__default(Logger.Level.INFO, {
    output
  }),
  stop: true
}, true);
Logger.addConfig({
  pattern: /^springbokjs-daemon:alp-dev:watch:output/,
  handler: new ConsoleLogger__default(Logger.Level.INFO, {
    output,
    formatter: formatterSimplified
  }),
  stop: true
}, true);
Promise.all([portscanner__default.findAPortNotInUse(startProxyPort, endProxyPort), portscanner__default.findAPortNotInUse(startAppPort, endAppPort), build('./src/config', () => {
  logger.warn('config changed, restarting server');
  if (nodeChild) nodeChild.sendSIGUSR2();
})]).then(([proxyPort, port]) => {
  if (proxyPort === port) {
    throw new Error(`"proxyPort" and "port" cannot have the same value: ${port}`);
  }
  const percentages = {
    node: 0,
    browser: 0
  };

  const handleMessage = (source, msg) => {
    if (msg === 'ready') ; else if (msg && msg.type === 'webpack-progress') {
      percentages[source] = msg.percentage;
      const message = msg.message;
      bar.update((percentages.node + percentages.browser) / 2, {
        msg: message.length > 20 ? `${message.slice(0, 20)}...` : message
      });
    }
  };

  nodeChild = createChild__default({
    key: 'alp-dev:watch:watch-server',
    displayName: 'alp-dev:watch-server',
    prefixStdout: true,
    outputKey: 'alp-dev:watch:output:watch-server',
    outputDisplayName: 'SERVER:',
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-node-')), '--port', port],
    env: { ...process.env,
      NIGHTINGALE_CONSOLE_FORMATTER: 'ansi'
    },
    onMessage: msg => handleMessage('node', msg)
  });
  const browserChild = createChild__default({
    key: 'alp-dev:watch:watch-browser',
    displayName: 'alp-dev:watch-browser',
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-browser-')), '--port', port, '--proxy-port', proxyPort, '--host', argv__default.host || ''],
    env: { ...process.env,
      NIGHTINGALE_CONSOLE_FORMATTER: 'ansi'
    },
    onMessage: msg => handleMessage('browser', msg)
  });
  Promise.all([nodeChild.start(), browserChild.start()]).then(() => {
    logger.success('ready', {
      port: proxyPort,
      serverPort: port
    });
  });

  const cleanup = () => {
    var _nodeChild;

    Promise.all([(_nodeChild = nodeChild) === null || _nodeChild === void 0 ? void 0 : _nodeChild.stop().catch(() => {}), browserChild === null || browserChild === void 0 ? void 0 : browserChild.stop().catch(() => {})]).then(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}).catch(err => console.log(err.stack));
//# sourceMappingURL=watch-node12-dev.cjs.js.map
