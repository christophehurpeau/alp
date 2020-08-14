import Logger, { addConfig, Level } from 'nightingale';
import ConsoleLogger from 'nightingale-console';
import { execSync } from 'child_process';
import path, { join, dirname } from 'path';
import formatterANSI from 'nightingale-ansi-formatter';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import createChild from 'springbokjs-daemon';
import colorette from 'colorette';
import ProgressBar from 'progress';
import fs, { readFileSync, watch } from 'fs';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { safeLoad } from 'js-yaml';

addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger(Level.NOTICE),
  stop: true
}, true);

function readFile(target) {
  return new Promise((resolve, reject) => {
    fs.readFile(target, 'utf-8', (err, content) => {
      if (err) {
        return reject(new Error(`Failed to read file "${target}": ${err.message || err}`));
      }

      resolve(content);
    });
  });
}

function writeFile(target, content) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(target), () => {
      fs.writeFile(target, content, err => {
        if (err) {
          return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
        }

        resolve();
      });
    });
  });
}

function loadConfigFile(content, dirname) {
  const data = safeLoad(content) || {};
  const config = data.shared || data.common || {};
  const serverConfig = { ...config,
    ...data.server
  };
  const browserConfig = { ...config,
    ...data.browser
  };

  if (data.include) {
    const includePaths = data.include.map(includePath => path.resolve(dirname, includePath));
    includePaths.map(includePath => readFileSync(includePath, 'utf-8')).map((content, index) => loadConfigFile(content, path.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
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
  const [serverConfig, browserConfig] = loadConfigFile(content, dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob.sync(join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = watch(filename, {
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
const logger = new Logger('alp-dev:watch', 'alp-dev');
execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);
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

addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger(Level.NOTICE, {
    output
  }),
  stop: true
}, true);
addConfig({
  pattern: /^alp-dev/,
  handler: new ConsoleLogger(Level.INFO, {
    output
  }),
  stop: true
}, true);
addConfig({
  pattern: /^springbokjs-daemon:alp-dev:watch:output/,
  handler: new ConsoleLogger(Level.INFO, {
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

  const cleanup = () => {
    var _nodeChild;

    Promise.all([(_nodeChild = nodeChild) === null || _nodeChild === void 0 ? void 0 : _nodeChild.stop().catch(() => {}), browserChild === null || browserChild === void 0 ? void 0 : browserChild.stop().catch(() => {})]).then(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}).catch(err => console.log(err.stack));
//# sourceMappingURL=watch-node10-dev.es.js.map
