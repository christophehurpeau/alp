'use strict';

const path = require('path');
require('react-dev-utils/evalSourceMapMiddleware');
require('react-dev-utils/ignoredFiles');
require('react-dev-utils/noopServiceWorkerMiddleware');
require('webpack-dev-server');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpack = require('webpack');
const child_process = require('child_process');
const util = require('util');
const nightingale = require('nightingale');
const ConsoleHandler = require('nightingale-console');
const Logger = require('nightingale-logger');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const ReactRefreshWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(ReactRefreshWebpackPlugin);
const CssMinimizerPlugin__default = /*#__PURE__*/_interopDefaultLegacy(CssMinimizerPlugin);
const TerserPlugin__default = /*#__PURE__*/_interopDefaultLegacy(TerserPlugin);
const WorkboxWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(WorkboxWebpackPlugin);
const CaseSensitivePathsPlugin__default = /*#__PURE__*/_interopDefaultLegacy(CaseSensitivePathsPlugin);
const webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);
const ConsoleHandler__default = /*#__PURE__*/_interopDefaultLegacy(ConsoleHandler);
const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
const formatWebpackMessages__default = /*#__PURE__*/_interopDefaultLegacy(formatWebpackMessages);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const autoprefixer__default = /*#__PURE__*/_interopDefaultLegacy(autoprefixer);
const MiniCssExtractPlugin__default = /*#__PURE__*/_interopDefaultLegacy(MiniCssExtractPlugin);

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
    const appWebpackConfigPath = path.resolve('createAppWebpackConfig.js');

    if (fs.existsSync(appWebpackConfigPath)) {
      console.info('Using app createAppWebpackConfig.js'); // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment

      const appWebpackConfigCreator = require(appWebpackConfigPath);

      if (typeof appWebpackConfigCreator !== 'function') {
        console.error("app createAppWebpackConfig.js should export a function\nmodule.exports = function (config, options) { ... }");
      }

      options = createOptions(options);
      const config = appWebpackConfigCreator(wrapCreateWebpackConfig, options);

      if (typeof config !== 'object') {
        console.error("app createAppWebpackConfig.js should return the config\nfunction (config, options) { return config(options); }");
      }

      return config;
    } else {
      return wrapCreateWebpackConfig(options);
    }
  };
}

/* eslint-disable no-console */
nightingale.addConfig({
  key: 'pobpack-utils',
  handler: new ConsoleHandler__default(nightingale.levels.INFO)
});
const logger = new Logger__default('pobpack-utils', 'pobpack');
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
      const messages = formatWebpackMessages__default(stats.toJson({})); // const messages = stats.toJson({}, true);

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
  const compiler = webpack__default(webpackConfig); // human-readable error messages

  new FriendlyErrorsWebpackPlugin({
    bundleName,
    successMessage
  }).apply(compiler);
  const promisifyRun = util.promisify(compiler.run.bind(compiler));
  return {
    compiler,
    webpackConfig,
    clean: () => {
      var _webpackConfig$output;

      if ((_webpackConfig$output = webpackConfig.output) !== null && _webpackConfig$output !== void 0 && _webpackConfig$output.path) {
        child_process.execSync(`rm -Rf ${webpackConfig.output.path}`);
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

function createModuleConfig(options) {
  return {
    strictExportPresence: true,
    rules: [// tsx? / jsx?
    {
      test: options.typescript ? /\.(mjs|[jt]sx?)$/ : /\.(mjs|jsx?)$/,
      include: [path.resolve(options.paths.src), ...options.includePaths],
      rules: [{
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          ...options.babel
        }
      }]
    }, // other rules
    ...(options.moduleRules || [])]
  };
}

const ExcludesFalsy$4 = Boolean;
function createPluginsConfig(options) {
  const plugins = [...(options.prependPlugins || []), // enforces the entire path of all required modules match the exact case
  // of the actual path on disk. Using this plugin helps alleviate cases
  // for developers working on case insensitive systems like OSX.
  options.env !== 'production' && new CaseSensitivePathsPlugin__default(), new webpack__default.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(options.env),
    ...options.defines
  }),
  /* replace object-assign ponyfill to use native implementation */
  // Array.isArray
  new webpack__default.NormalModuleReplacementPlugin(/.*\/node_modules\/isarray\/index.js$/, require.resolve('../replacements/Array.isArray.js')), // Object.assign
  new webpack__default.NormalModuleReplacementPlugin(/.*\/node_modules\/(object-assign|extend-shallow)\/index.js$/, require.resolve('../replacements/Object.assign.js')), // Object.setPrototypeOf
  new webpack__default.NormalModuleReplacementPlugin(/.*\/node_modules\/setprototypeof\/index.js$/, require.resolve('../replacements/Object.setPrototypeOf.js')), // Promise
  new webpack__default.NormalModuleReplacementPlugin(/.*\/node_modules\/any-promise\/index.js$/, require.resolve('../replacements/Promise.js')), // String.prototype.repeat
  new webpack__default.NormalModuleReplacementPlugin(/.*\/node_modules\/repeat-string\/index.js$/, require.resolve('../replacements/String.prototype.repeat.js')), // Symbol.observable
  // https://github.com/tc39/proposal-observable
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/observable
  // new webpack.NormalModuleReplacementPlugin(
  //   /.*\/node_modules\/symbol-observable\/es\/ponyfill.js$/,
  //   require.resolve('../replacements/Symbol.observable.js'),
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
    modules: ['node_modules', path.resolve('src')],
    extensions: [options.typescript && '.ts', options.typescript && '.tsx', '.mjs', '.js', '.jsx'].filter(ExcludesFalsy$3),
    conditionNames: [...conditionNames, options.env !== 'production' ? 'development' : undefined, 'import'].filter(ExcludesFalsy$3),
    mainFields: [...[].concat(...modulePrefixPackageFields.map(prefix => [options.env !== 'production' && `module:${prefix}-dev`, `module:${prefix}`, // old `webpack:` syntax
    options.env !== 'production' && `webpack:${prefix}-dev`, `webpack:${prefix}`])), options.env !== 'production' && 'module-dev', 'module', // old webpack: syntax
    options.env !== 'production' && 'webpack:main-dev', 'webpack:main', ...(!modulePrefixPackageFields.includes('browser') ? [] : [// Browser builds
    options.env !== 'production' && 'browser-dev', 'browser']), options.env !== 'production' && 'main-dev', 'main'].filter(ExcludesFalsy$3),
    aliasFields: [...[].concat(...modulePrefixPackageFields.map(prefix => [options.env !== 'production' && `module:aliases-${prefix}-dev`, `module:aliases-${prefix}`, // old webpack: syntax
    options.env !== 'production' && `webpack:aliases-${prefix}-dev`, `webpack:aliases-${prefix}`])), options.env !== 'production' && 'module:aliases-dev', 'module:aliases', // old webpack: syntax
    options.env !== 'production' && 'webpack:aliases-dev', 'webpack:aliases', 'webpack', modulePrefixPackageFields.includes('browser') && options.env !== 'production' && 'browser-dev', modulePrefixPackageFields.includes('browser') && 'browser'].filter(ExcludesFalsy$3),
    alias: { ...options.aliases,
      ...targetAliases
    }
  };
}

/* eslint-disable camelcase */
const MODERN = 'modern';
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
      new TerserPlugin__default({
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
      new CssMinimizerPlugin__default()]
    },
    // use cache
    cache: options.hmr,
    resolveLoader: {
      modules: options.resolveLoaderModules || ['node_modules']
    },
    resolve: createResolveConfig([target === MODERN ? 'modern-browsers' : undefined, 'browser'].filter(ExcludesFalsy$2), [target === MODERN ? 'browser:modern' : undefined, 'browser', options.env === 'production' ? 'production' : 'development'].filter(ExcludesFalsy$2), { ...options,
      babel: { ...options.babel,
        plugins: [...(options.babel.plugins || []), options.hmr && require.resolve('react-refresh/babel')].filter(ExcludesFalsy$2)
      }
    }, {
      'react-native$': 'react-native-web',
      ...(options.productionProfiling ? {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling'
      } : {})
    }),
    entry: options.entries.reduce((entries, entry) => {
      if (typeof entry === 'string') entry = {
        key: entry,
        path: entry
      };
      entries[entry.key] = [// options.env !== 'production' && require.resolve('../source-map-support'),
      target !== MODERN && require.resolve('regenerator-runtime/runtime'), path__default.join(path__default.resolve(options.paths.src), entry.path)].filter(ExcludesFalsy$2);
      return entries;
    }, {}),
    output: {
      path: path__default.resolve(options.paths.build),
      pathinfo: options.env !== 'production',
      filename: options.env !== 'production' ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle-[name].js',
      chunkFilename: options.env !== 'production' ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[contenthash:8][ext]',
      publicPath: options.paths.build,
      // Point sourcemap entries to original disk location
      devtoolModuleFilenameTemplate: options.env === 'production' ? info => path__default.relative(options.paths.src, info.absoluteResourcePath).replace(/\\/g, '/') : // eslint-disable-next-line unicorn/no-nested-ternary
      options.env === 'development' ? info => path__default.resolve(info.absoluteResourcePath).replace(/\\/g, '/') : undefined
    },
    module: createModuleConfig(options),
    plugins: [...createPluginsConfig(options), options.hmr && new ReactRefreshWebpackPlugin__default({
      overlay: false
    }), options.env === 'production' && options.paths.src && options.serviceWorkerEntry ? new WorkboxWebpackPlugin__default.InjectManifest({
      swSrc: path__default.resolve(options.paths.src, options.serviceWorkerEntry.endsWith('.js') || options.serviceWorkerEntry.endsWith('.ts') ? options.serviceWorkerEntry : `${options.serviceWorkerEntry}${options.typescript ? '.ts' : '.js'}`),
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
//   options: Partial<Options>,
//   runOptions: RunOptions,
// ): PobpackBrowserCompiler => {
//   const url = `http${runOptions.https ? 's' : ''}://localhost:${
//     runOptions.port
//   }`;
//   const compiler: PobpackCompiler = createAppBrowserCompiler(
//     MODERN,
//     { ...options, hmr: true },
//     {
//       successMessage: `Your application is running here: ${url}`,
//     },
//   );
//   compiler.clean();
//   const webpackDevServer = runDevServer(compiler, runOptions);
//   return { ...compiler, webpackDevServer };
// };

/* eslint-disable max-lines, complexity */
const ExcludesFalsy$1 = Boolean;

const resolveLoader = loader => require.resolve(loader);

const cssLoaderOptions = function (importLoaders, global, production, targetIsNode) {
  return {
    sourceMap: !production,
    modules: global ? false : {
      exportOnlyLocals: targetIsNode,
      localIdentName: production !== false ? '[hash:base64]' : '[name]__[local]___[hash:base64:5]'
    },
    importLoaders
  };
};

const createCssModuleUse = function ({
  target,
  extractLoader,
  global = false,
  plugins,
  production,
  otherLoaders = []
}) {
  if (global && target === 'node') {
    return [{
      loader: resolveLoader('ignore-loader')
    }];
  }

  return [target !== 'node' && extractLoader, {
    loader: resolveLoader('css-loader'),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    options: cssLoaderOptions(otherLoaders.length + 1 + (!global && !production ? 1 : 0), global, production, target === 'node')
  }, !global && !production && target !== 'node' && {
    loader: resolveLoader('typed-css-modules-loader'),
    options: {
      noEmit: true
    }
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

const createScssModuleUse = function ({
  target,
  extractLoader,
  global = false,
  plugins,
  production,
  themeFile,
  includePaths = []
}) {
  return createCssModuleUse({
    target,
    extractLoader,
    global,
    plugins,
    production,
    otherLoaders: [{
      loader: resolveLoader('sass-loader'),
      options: {
        sourceMap: !production,
        additionalData: `$env: ${process.env.NODE_ENV};${themeFile ? `@import '${path__default.resolve(themeFile)}';` : ''}`,
        sassOptions: {
          outputStyle: production !== false ? undefined : 'compressed',
          includePaths
        }
      }
    }]
  });
};

const createCssModuleRule = function (options) {
  return {
    test: /\.css$/,
    sideEffects: true,
    use: createCssModuleUse(options)
  };
};
const createModuleRules = function ({
  target,
  extractLoader,
  plugins,
  production,
  themeFile,
  includePaths
}) {
  return [{
    test: /\.scss$/,
    oneOf: [{
      test: /\.global\.scss$/,
      sideEffects: true,
      use: createScssModuleUse({
        target,
        extractLoader,
        global: true,
        plugins,
        production,
        themeFile,
        includePaths
      })
    }, {
      sideEffects: true,
      use: createScssModuleUse({
        target,
        extractLoader,
        global: false,
        plugins,
        production,
        themeFile,
        includePaths
      })
    }]
  }, createCssModuleRule({
    target,
    extractLoader,
    global: false,
    plugins,
    production
  })];
};

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, complexity, max-lines */

const ExcludesFalsy = Boolean;
function createPobpackConfig(target, production = false) {
  const pkg = JSON.parse(fs__default.readFileSync(path__default.resolve('package.json'), 'utf-8'));
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
      key: target === 'node' ? 'index' : // eslint-disable-next-line unicorn/no-nested-ternary
      target === 'browser' ? 'es5' : 'modern-browsers',
      path: target === 'node' ? 'index.server.ts' : 'index.browser.ts'
    }],
    resolveLoaderModules: [path__default.join(__dirname, '../..', 'node_modules'), 'node_modules'],
    babel: {
      minified: target !== 'node' && production,
      comments: !(target !== 'node' && production),
      presets: [// add react preset with jsx
      [require.resolve('@babel/preset-react'), {
        development: !production,
        useBuiltIns: true,
        runtime: 'automatic'
      }], // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
      [require.resolve('babel-preset-pob-env'), {
        resolvePreset: preset => require.resolve(preset),
        production,
        typescript: true,
        optimizations: true,
        target: target === 'node' ? 'node' : 'browser',
        version: target === 'node' ? '12.10' : // eslint-disable-next-line unicorn/no-nested-ternary
        target === 'modern-browser' ? 'modern' : undefined,
        loose: true,
        modules: false
      }]],
      plugins: [require.resolve('babel-plugin-inline-classnames-babel7'), hasAntd && [require.resolve('babel-plugin-import'), {
        libraryName: 'antd',
        libraryDirectory: target === 'node' ? 'lib' : 'es',
        style: target !== 'node'
      }]].filter(ExcludesFalsy)
    },
    moduleRules: [// SCSS RULE, CSS RULE
    ...createModuleRules({
      target,
      extractLoader: {
        loader: MiniCssExtractPlugin__default.loader,
        options: {
          esModule: true
        }
      },
      production,
      themeFile: './src/theme.scss',
      plugins: [autoprefixer__default],
      includePaths: [path__default.resolve('./node_modules')]
    }), // LESS RULE (antd)
    {
      test: /\.less$/,
      use: createCssModuleUse({
        global: true,
        target,
        extractLoader: {
          loader: MiniCssExtractPlugin__default.loader,
          options: {
            publicPath: '../..'
          }
        },
        production,
        plugins: [autoprefixer__default],
        otherLoaders: [{
          loader: require.resolve('less-loader'),
          options: {
            javascriptEnabled: true // modifyVars: path.resolve('./src/less-modifyVars.js'),

          }
        }, {
          loader: require.resolve('less-modify-var-loader'),
          options: {
            filePath: path__default.resolve('./src/theme.less')
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
    plugins: [new MiniCssExtractPlugin__default({
      experimentalUseImportModule: true,
      filename: `${target === 'node' ? 'server' : // eslint-disable-next-line unicorn/no-nested-ternary
      target === 'browser' ? 'es5' : 'modern-browsers'}.css`,
      // [name].[contenthash:8].css
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      runtime: target !== 'node'
    }), process.send && new webpack__default.ProgressPlugin((percentage, message) => {
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
//# sourceMappingURL=build-modern-browser-node12-dev.cjs.js.map
