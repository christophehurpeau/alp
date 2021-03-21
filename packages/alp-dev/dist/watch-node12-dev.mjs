import { execSync } from 'child_process';
import path, { join, dirname } from 'path';
import colorette from 'colorette';
import argv from 'minimist-argv';
import Logger, { addConfig, Level } from 'nightingale';
import formatterANSI from 'nightingale-ansi-formatter';
import ConsoleLogger from 'nightingale-console';
import portscanner from 'portscanner';
import ProgressBar from 'progress';
import createChild from 'springbokjs-daemon';
import fs, { readFileSync, watch } from 'fs';
import glob from 'glob';
import { safeLoad } from 'js-yaml';

/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
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

function readFile(target) {
  return new Promise((resolve, reject) => {
    fs.readFile(target, 'utf-8', (err, content) => {
      if (err) {
        return reject( // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        new Error(`Failed to read file "${target}": ${err.message || err}`));
      }

      resolve(content);
    });
  });
}

function writeFile(target, content) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(target), {
      recursive: true
    }, () => {
      fs.writeFile(target, content, err => {
        if (err) {
          return reject(new Error( // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Failed to write file "${target}": ${err.message || err}`));
        }

        resolve();
      });
    });
  });
}

const compileYml = async filename => {
  const content = await readFile(filename);
  const [serverConfig, browserConfig] = loadConfigFile(content, dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  await Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      percentages[source] = msg.percentage; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access

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
  }); // eslint-disable-next-line @typescript-eslint/no-floating-promises

  Promise.all([nodeChild.start(), browserChild.start()]).then(() => {
    logger.success('ready', {
      port: proxyPort,
      serverPort: port
    });
  });

  const cleanup = () => {
    var _nodeChild;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.all([(_nodeChild = nodeChild) === null || _nodeChild === void 0 ? void 0 : _nodeChild.stop().catch(() => {}), browserChild === null || browserChild === void 0 ? void 0 : browserChild.stop().catch(() => {})]).then(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}) // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
.catch(err => console.log(err.stack));
//# sourceMappingURL=watch-node12-dev.mjs.map
