import path, { resolve } from 'path';
import 'react-dev-utils/evalSourceMapMiddleware.js';
import 'react-dev-utils/ignoredFiles.js';
import 'react-dev-utils/noopServiceWorkerMiddleware.js';
import 'webpack-dev-server';
import { URL } from 'url';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';
import { execSync } from 'child_process';
import { promisify } from 'util';
import { addConfig, levels } from 'nightingale';
import { ConsoleHandler } from 'nightingale-console';
import { Logger } from 'nightingale-logger';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages.js';
import fs, { existsSync } from 'fs';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/* eslint-disable complexity */
function createOptions(options) {
  return {
    aliases: options.aliases || {},
    babel: options.babel || {},
    defines: options.defines || {},
    entries: options.entries || ['index'],
    serviceWorkerEntry: options.serviceWorkerEntry === undefined ? 'service-worker' : options.serviceWorkerEntry,
    env: options.env || process.env.NODE_ENV,
    hmr: options.hmr,
    allowlistExternalExtensions: options.allowlistExternalExtensions || [],
    includePaths: options.includePaths || [],
    moduleRules: options.moduleRules,
    jsModuleRules: options.jsModuleRules,
    paths: {
      src: 'src',
      build: 'build',
      ...options.paths
    },
    plugins: options.plugins || [],
    prependPlugins: options.prependPlugins || [],
    resolveLoaderModules: options.resolveLoaderModules,
    typescript: options.typescript || false,
    webpackPrefixPackageFields: options.webpackPrefixPackageFields || []
  };
}

function createAppWebpackConfig(createWebpackConfig) {
  const wrapCreateWebpackConfig = options => createWebpackConfig(createOptions(options));

  return options => {
    const appWebpackConfigPath = resolve('createAppWebpackConfig.js');

    if (existsSync(appWebpackConfigPath)) {
      throw new Error('createAppWebpackConfig.js is no longer supported'); // console.info('Using app createAppWebpackConfig.js');
      // // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
      // const appWebpackConfigCreator: AppWebpackConfigCreator = require(appWebpackConfigPath);
      // if (typeof appWebpackConfigCreator !== 'function') {
      //   console.error(
      //     'app createAppWebpackConfig.js should export a function\n' +
      //       'module.exports = function (config, options) { ... }',
      //   );
      // }
      // options = createOptions(options);
      // const config = appWebpackConfigCreator(wrapCreateWebpackConfig, options);
      // if (typeof config !== 'object') {
      //   console.error(
      //     'app createAppWebpackConfig.js should return the config\n' +
      //       'function (config, options) { return config(options); }',
      //   );
      // }
      // return config;
    } else {
      return wrapCreateWebpackConfig(options);
    }
  };
}

/* eslint-disable no-console */
addConfig({
  key: 'pobpack-utils',
  handler: new ConsoleHandler(levels.INFO)
});
const logger = new Logger('pobpack-utils', 'pobpack');
const pluginName = 'pobpack/FriendlyErrorsWebpackPlugin';
class FriendlyErrorsWebpackPlugin {
  constructor(options) {
    this.bundleName = options.bundleName;
    this.successMessage = options.successMessage;
    this.logger = logger.context({
      bundleName: options.bundleName
    });
  }

  apply(compiler) {
    // webpack is recompiling
    compiler.hooks.invalid.tap(pluginName, () => {
      this.logger.info('Compiling...');
    }); // compilation done

    compiler.hooks.done.tap(pluginName, stats => {
      const messages = formatWebpackMessages(stats.toJson({})); // const messages = stats.toJson({}, true);

      if (messages.errors.length > 0) {
        if (process.send) {
          process.send({
            type: 'failed-to-compile',
            errors: messages.errors.join('\n'),
            bundleName: this.bundleName
          });
        } else {
          this.logger.critical('Failed to compile.');
          console.log();
          messages.errors.forEach(message => {
            console.log(message);
            console.log();
          });
        }

        return;
      }

      if (process.send) process.send('ready');

      if (messages.warnings.length > 0) {
        if (process.send) {
          process.send({
            type: 'compiled-with-arnings',
            warnings: messages.warnings.join('\n'),
            bundleName: this.bundleName
          });
        } else {
          this.logger.critical('Compiled with warnings.');
          console.log();
          messages.warnings.forEach(message => {
            console.log(message);
            console.log();
          });
        }
      }

      if (process.send) {
        process.send({
          type: 'compiled-successfully',
          bundleName: this.bundleName
        });
      } else {
        this.logger.success('Compiled successfully!');

        if (this.successMessage) {
          console.log(this.successMessage);
        }
      }
    });
  }

}

const buildThrowOnError = stats => {
  if (!stats) return stats;

  if (!stats.hasErrors()) {
    return stats;
  }

  throw new Error(stats.toString({}));
};

function createPobpackCompiler(bundleName, webpackConfig, {
  successMessage
} = {}) {
  const compiler = webpack(webpackConfig); // human-readable error messages

  new FriendlyErrorsWebpackPlugin({
    bundleName,
    successMessage
  }).apply(compiler);
  const promisifyRun = promisify(compiler.run.bind(compiler));
  return {
    compiler,
    webpackConfig,
    clean: () => {
      if (webpackConfig.output?.path) {
        execSync(`rm -Rf ${webpackConfig.output.path}`);
      }

      return undefined;
    },
    run: () => promisifyRun().then(buildThrowOnError),
    watch: callback => compiler.watch({}, (err, stats) => {
      if (err || !stats) return;
      if (stats.hasErrors()) return;
      buildThrowOnError(stats);
      callback(stats);
    })
  };
}

const resolveDependency$3 = dependency => dependency; // TODO require.resolve(path)


function createModuleConfig(options) {
  return {
    strictExportPresence: true,
    rules: [// tsx? / jsx?
    {
      test: options.typescript ? /\.(mjs|[jt]sx?)$/ : /\.(mjs|jsx?)$/,
      include: [resolve(options.paths.src), ...options.includePaths],
      rules: [{
        loader: resolveDependency$3('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          ...options.babel
        }
      }, ...(options.jsModuleRules || [])]
    }, // other rules
    ...(options.moduleRules || [])]
  };
}

const ExcludesFalsy$4 = Boolean;
const DEV_CONST = '(process.env.NODE_ENV !== "production")';
function createPluginsConfig(options) {
  const plugins = [...(options.prependPlugins || []), // enforces the entire path of all required modules match the exact case
  // of the actual path on disk. Using this plugin helps alleviate cases
  // for developers working on case insensitive systems like OSX.
  options.env !== 'production' && new CaseSensitivePathsPlugin(), new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(options.env),
    [DEV_CONST]: JSON.stringify(options.env !== 'production'),
    ...options.defines
  }),
  /* replace object-assign ponyfill to use native implementation */
  // Array.isArray
  new webpack.NormalModuleReplacementPlugin(/.*\/node_modules\/isarray\/index.js$/, new URL('../replacements/Array.isArray.cjs', import.meta.url).pathname), // Object.assign
  new webpack.NormalModuleReplacementPlugin(/.*\/node_modules\/(object-assign|extend-shallow)\/index.js$/, new URL('../replacements/Object.assign.cjs', import.meta.url).pathname), // Object.setPrototypeOf
  new webpack.NormalModuleReplacementPlugin(/.*\/node_modules\/setprototypeof\/index.js$/, new URL('../replacements/Object.setPrototypeOf.cjs', import.meta.url).pathname), // Promise
  new webpack.NormalModuleReplacementPlugin(/.*\/node_modules\/any-promise\/index.js$/, new URL('../replacements/Promise.cjs', import.meta.url).pathname), // String.prototype.repeat
  new webpack.NormalModuleReplacementPlugin(/.*\/node_modules\/repeat-string\/index.js$/, new URL('../replacements/String.prototype.repeat.cjs', import.meta.url).pathname), // Symbol.observable
  // https://github.com/tc39/proposal-observable
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/observable
  // new webpack.NormalModuleReplacementPlugin(
  //   /.*\/node_modules\/symbol-observable\/es\/ponyfill.js$/,
  //   new URL('../replacements/Symbol.observable.js', import.meta.url).pathname,
  // ),
  ...options.plugins];
  return plugins.filter(ExcludesFalsy$4);
}

/* eslint-disable complexity */
const ExcludesFalsy$3 = Boolean;
function createResolveConfig(modulePrefixPackageFields, conditionNames, options, targetAliases) {
  return {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/25209
    // cacheWithContext: false,
    modules: ['node_modules', resolve('src')],
    extensions: [options.typescript && '.ts', options.typescript && '.tsx', '.mjs', '.js', '.jsx'].filter(ExcludesFalsy$3),
    conditionNames: [...conditionNames, options.env !== 'production' ? 'development' : undefined, 'import'].filter(ExcludesFalsy$3),
    mainFields: [// eslint-disable-next-line unicorn/prefer-spread
    ...[].concat(...modulePrefixPackageFields.map(prefix => [options.env !== 'production' && `module:${prefix}-dev`, `module:${prefix}`, // old `webpack:` syntax
    options.env !== 'production' && `webpack:${prefix}-dev`, `webpack:${prefix}`])), options.env !== 'production' && 'module-dev', 'module', // old webpack: syntax
    options.env !== 'production' && 'webpack:main-dev', 'webpack:main', ...(!modulePrefixPackageFields.includes('browser') ? [] : [// Browser builds
    options.env !== 'production' && 'browser-dev', 'browser']), options.env !== 'production' && 'main-dev', 'main'].filter(ExcludesFalsy$3),
    aliasFields: [// eslint-disable-next-line unicorn/prefer-spread
    ...[].concat(...modulePrefixPackageFields.map(prefix => [options.env !== 'production' && `module:aliases-${prefix}-dev`, `module:aliases-${prefix}`, // old webpack: syntax
    options.env !== 'production' && `webpack:aliases-${prefix}-dev`, `webpack:aliases-${prefix}`])), options.env !== 'production' && 'module:aliases-dev', 'module:aliases', // old webpack: syntax
    options.env !== 'production' && 'webpack:aliases-dev', 'webpack:aliases', 'webpack', modulePrefixPackageFields.includes('browser') && options.env !== 'production' && 'browser-dev', modulePrefixPackageFields.includes('browser') && 'browser'].filter(ExcludesFalsy$3),
    alias: { ...options.aliases,
      ...targetAliases
    }
  };
}

/* eslint-disable camelcase */
const MODERN = 'modern';

const resolveDependency$2 = dependency => dependency; // TODO require.resolve(path)


const ExcludesFalsy$2 = Boolean;
function createBrowserWebpackConfig(target) {
  return options => ({
    // production or development
    mode: options.env === 'production' ? 'production' : 'development',
    // Don't attempt to continue if there are any errors.
    bail: options.env === 'production',
    // Target web
    target: target === MODERN ? 'browserslist:modern' : 'browserslist',
    // get right stack traces
    devtool: options.env === 'production' ? 'nosources-source-map' : 'source-map',
    infrastructureLogging: {
      level: 'none'
    },
    optimization: {
      nodeEnv: false,
      // see createPluginsConfig
      emitOnErrors: false,
      minimize: options.env === 'production',
      minimizer: [// This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 2019
          },
          compress: {
            ecma: 5
          },
          mangle: {
            safari10: true
          },
          // Added for profiling in devtools
          keep_classnames: options.productionProfiling || false,
          keep_fnames: options.productionProfiling || false,
          output: {
            ecma: 5,
            comments: false,
            // issue with emoji
            ascii_only: true
          }
        }
      }), // This is only used in production mode
      new CssMinimizerPlugin()]
    },
    // use cache
    cache: options.hmr,
    resolveLoader: {
      modules: options.resolveLoaderModules || ['node_modules']
    },
    resolve: createResolveConfig([target === MODERN ? 'modern-browsers' : undefined, 'browser'].filter(ExcludesFalsy$2), [target === MODERN ? 'browser:modern' : undefined, 'browser', options.env === 'production' ? 'production' : 'development'].filter(ExcludesFalsy$2), { ...options,
      babel: { ...options.babel,
        plugins: [...(options.babel.plugins || []), options.hmr && resolveDependency$2('react-refresh/babel')].filter(ExcludesFalsy$2)
      }
    }, {
      'react-native$': 'react-native-web',
      ...(options.productionProfiling ? {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling'
      } : {})
    }),
    // eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
    entry: options.entries.reduce((entries, entry) => {
      if (typeof entry === 'string') entry = {
        key: entry,
        path: entry
      };
      entries[entry.key] = [options.env !== 'production' && new URL('../source-map-support.cjs', import.meta.url).pathname, target !== MODERN && resolveDependency$2('regenerator-runtime/runtime'), path.join(path.resolve(options.paths.src), entry.path)].filter(ExcludesFalsy$2);
      return entries;
    }, {}),
    output: {
      path: path.resolve(options.paths.build),
      pathinfo: options.env !== 'production',
      filename: '[name].js',
      chunkFilename: options.env !== 'production' ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[contenthash:8][ext]',
      publicPath: options.paths.build,
      // Point sourcemap entries to original disk location
      devtoolModuleFilenameTemplate: options.env === 'production' ? info => path.relative(options.paths.src, info.absoluteResourcePath).replace(/\\/g, '/') : options.env === 'development' ? info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/') : undefined
    },
    module: createModuleConfig(options),
    plugins: [...createPluginsConfig(options), options.hmr && new ReactRefreshWebpackPlugin({
      overlay: false
    }), options.env === 'production' && options.paths.src && options.serviceWorkerEntry ? new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(options.paths.src, options.serviceWorkerEntry.endsWith('.js') || options.serviceWorkerEntry.endsWith('.ts') ? options.serviceWorkerEntry : `${options.serviceWorkerEntry}${options.typescript ? '.ts' : '.js'}`),
      compileSrc: true,
      dontCacheBustURLsMatching: /\.[\da-f]{8}\./,
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/]
    }) : undefined].filter(ExcludesFalsy$2)
  });
}

const createAppBrowserCompiler = (target, options, compilerOptions) => createPobpackCompiler(target, createAppWebpackConfig(createBrowserWebpackConfig(target))({
  entries: [{
    key: target,
    path: 'index'
  }],
  // override default entry
  ...options,
  paths: {
    build: 'public',
    ...options.paths
  }
}), compilerOptions);

const ExcludesFalsy$1 = Boolean;

const resolveDependency$1 = dependency => dependency; // TODO require.resolve(path)


const resolveLoader = loader => resolveDependency$1(loader);

const cssLoaderOptions = function (importLoaders, production, targetIsNode) {
  return {
    sourceMap: !production,
    modules: global ? false : {
      exportOnlyLocals: targetIsNode,
      localIdentName: production ? '[hash:base64]' : '[name]__[local]___[hash:base64:5]'
    },
    importLoaders
  };
};

const createCssUse = function ({
  target,
  extractLoader,
  plugins,
  production,
  otherLoaders = []
}) {
  if (target === 'node') {
    return [{
      loader: resolveLoader('ignore-loader')
    }];
  }

  return [extractLoader, {
    loader: resolveLoader('css-loader'),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    options: cssLoaderOptions(otherLoaders.length + 1, production, false)
  }, {
    loader: resolveLoader('postcss-loader'),
    options: {
      sourceMap: !production,
      postcssOptions: {
        ident: 'postcss',
        plugins
      }
    }
  }, ...otherLoaders].filter(ExcludesFalsy$1);
};
const createCssRule = function (options) {
  return {
    test: /\.css$/,
    sideEffects: true,
    use: createCssUse(options)
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, complexity, max-lines */

const resolveDependency = dependency => dependency; // TODO require.resolve(path)
// stylesCacheGroups


const ExcludesFalsy = Boolean;
function createPobpackConfig(target, production = false) {
  const pkg = JSON.parse( // eslint-disable-next-line unicorn/prefer-json-parse-buffer
  fs.readFileSync(path.resolve('package.json'), 'utf-8'));
  const deps = pkg.dependencies || {};
  const devdeps = pkg.devDependencies || {};
  const hasAntd = !!deps.antd;

  if (deps.antd) {
    if (!devdeps.less) {
      throw new Error('less missing: yarn add --dev less');
    }
  }

  return {
    env: process.env.NODE_ENV,
    hmr: !production,
    typescript: true,
    allowlistExternalExtensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'scss', 'css'],
    paths: {
      build: target === 'node' ? 'build' : 'public'
    },
    entries: [{
      key: target === 'node' ? 'index' : target === 'browser' ? 'es5' : 'modern-browsers',
      path: target === 'node' ? 'index.server.ts' : 'index.browser.ts'
    }],
    resolveLoaderModules: ['node_modules'],
    babel: {
      minified: target !== 'node' && production,
      comments: !(target !== 'node' && production),
      presets: [// add react preset with jsx
      [resolveDependency('@babel/preset-react'), {
        development: !production,
        useBuiltIns: true,
        runtime: 'automatic'
      }], // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
      [resolveDependency('babel-preset-pob-env'), {
        resolvePreset: preset => resolveDependency(preset),
        typescript: true,
        optimizations: true,
        target: target === 'node' ? 'node' : 'browser',
        version: target === 'node' ? '14' : target === 'modern-browser' ? 'modern' : undefined,
        loose: true,
        modules: false
      }], // linaria support
      [resolveDependency('@linaria/babel-preset'), {}]],
      plugins: [hasAntd && [resolveDependency('babel-plugin-import'), {
        libraryName: 'antd',
        libraryDirectory: target === 'node' ? 'lib' : 'es',
        style: target !== 'node'
      }]].filter(ExcludesFalsy)
    },
    jsModuleRules: [{
      loader: resolveDependency('@linaria/webpack5-loader'),
      options: {
        sourceMap: !production,
        babelOptions: {
          presets: ['@babel/preset-typescript']
        }
      }
    }],
    moduleRules: [// CSS RULE
    createCssRule({
      target,
      extractLoader: {
        loader: MiniCssExtractPlugin.loader,
        options: {
          emit: target !== 'node'
        }
      },
      production,
      plugins: [autoprefixer]
    }), // LESS RULE (antd)
    {
      test: /\.less$/,
      use: createCssUse({
        target,
        extractLoader: {
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: target !== 'node',
            publicPath: '../..'
          }
        },
        production,
        plugins: [autoprefixer],
        otherLoaders: [{
          loader: resolveDependency('less-loader'),
          options: {
            javascriptEnabled: true // modifyVars: path.resolve('./src/less-modifyVars.js'),

          }
        }, {
          loader: resolveDependency('less-modify-var-loader'),
          options: {
            filePath: path.resolve('./src/theme.less')
          }
        }]
      })
    }, // IMG RULE
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 1024 // 1kb

        }
      }
    }],
    // TODO https://github.com/zeit/next.js/blob/7d78c3b64185d6d6417f1af9cde4a69d32b18cc6/packages/next/build/webpack.js
    // optimization: {
    //   minimizer:
    //     target === 'browser' ? [new OptimizeCssAssetsPlugin()] : undefined,
    //   splitChunks: {
    //     cacheGroups: {
    //       styles: stylesCacheGroups,
    //     },
    //   },
    // },
    plugins: [new MiniCssExtractPlugin({
      experimentalUseImportModule: true,
      filename: `${target === 'node' ? 'server' : target === 'browser' ? 'es5' : 'modern-browsers'}.css`,
      // [name].[contenthash:8].css
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      runtime: false // target !== 'node',

    }), process.send && new webpack.ProgressPlugin((percentage, message) => {
      process.send({
        type: 'webpack-progress',
        percentage,
        message
      });
    }) // TODO https://github.com/NekR/offline-plugin
    ].filter(ExcludesFalsy)
  };
}

const createModernBrowserCompiler = production => createAppBrowserCompiler(MODERN, createPobpackConfig('modern-browser', production), {
  progressBar: false
});

const browserCompiler = createModernBrowserCompiler(process.env.NODE_ENV !== 'development'); // eslint-disable-next-line @typescript-eslint/no-floating-promises

browserCompiler.run();
//# sourceMappingURL=build-modern-browser-node14.mjs.map
