import Logger, { addConfig, Level } from 'nightingale';
import ConsoleLogger from 'nightingale-console';
import { execSync } from 'child_process';
import path, { join, dirname } from 'path';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import createChild from 'springbokjs-daemon';
import fs, { readFileSync, watch } from 'fs';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { safeLoad } from 'js-yaml';

addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger(Level.NOTICE),
  stop: true
}, true);
addConfig({
  pattern: /^alp-dev/,
  handler: new ConsoleLogger(Level.INFO),
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
const logger = new Logger('alp-dev:watch', 'alp-dev');
execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);
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
//# sourceMappingURL=watch-node10-dev.es.js.map
