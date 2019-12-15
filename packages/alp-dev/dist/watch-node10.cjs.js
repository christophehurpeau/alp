'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const Logger = require('nightingale');
const Logger__default = _interopDefault(Logger);
const ConsoleLogger = _interopDefault(require('nightingale-console'));
const child_process = require('child_process');
const path = require('path');
const path__default = _interopDefault(path);
const formatterANSI = _interopDefault(require('nightingale-ansi-formatter'));
const portscanner = _interopDefault(require('portscanner'));
const argv = _interopDefault(require('minimist-argv'));
const createChild = _interopDefault(require('springbokjs-daemon'));
const colorette = _interopDefault(require('colorette'));
const ProgressBar = _interopDefault(require('progress'));
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

const startProxyPort = argv.browserSyncStartPort || 3000;
const startAppPort = argv.startAppPort || 3050;
const endProxyPort = startProxyPort + 49;
const endAppPort = startAppPort + 49;
const logger = new Logger__default('alp-dev:watch', 'alp-dev');
child_process.execSync(`rm -Rf ${path__default.resolve('public')}/* ${path__default.resolve('build')}/*`);
let nodeChild;
const bar = new ProgressBar(`${colorette.bold(colorette.yellow('Building...'))} ${colorette.bold(':percent')} [:bar] → :msg`, {
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
}) => formatterANSI(restRecord);

Logger.addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger(Logger.Level.NOTICE, {
    output
  }),
  stop: true
}, true);
Logger.addConfig({
  pattern: /^alp-dev/,
  handler: new ConsoleLogger(Logger.Level.INFO, {
    output
  }),
  stop: true
}, true);
Logger.addConfig({
  pattern: /^springbokjs-daemon:alp-dev:watch:output/,
  handler: new ConsoleLogger(Logger.Level.INFO, {
    output,
    formatter: formatterSimplified
  }),
  stop: true
}, true);
Promise.all([portscanner.findAPortNotInUse(startProxyPort, endProxyPort), portscanner.findAPortNotInUse(startAppPort, endAppPort), build('./src/config', () => {
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

  nodeChild = createChild({
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
  const browserChild = createChild({
    key: 'alp-dev:watch:watch-browser',
    displayName: 'alp-dev:watch-browser',
    autoRestart: true,
    args: [require.resolve(__filename.replace('/watch-', '/watch-browser-')), '--port', port, '--proxy-port', proxyPort, '--host', argv.host || ''],
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
}).catch(err => console.log(err.stack));
//# sourceMappingURL=watch-node10.cjs.js.map
