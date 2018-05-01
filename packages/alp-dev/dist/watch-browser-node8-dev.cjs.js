'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var presetPobEnv = _interopDefault(require('babel-preset-pob-env'));
var presetReact = _interopDefault(require('@babel/preset-react'));
var presetFlow = _interopDefault(require('@babel/preset-flow'));
var OptimizeCssAssetsPlugin = _interopDefault(require('optimize-css-assets-webpack-plugin'));
var BabelMinifyPlugin = _interopDefault(require('babel-minify-webpack-plugin'));
var webpack = require('webpack');
var MiniCssExtractPlugin = _interopDefault(require('mini-css-extract-plugin'));
var autoprefixer = _interopDefault(require('autoprefixer'));
var webpackConfig = require('ynnub/webpack-config');
var pobpackBrowser = require('pobpack-browser');
var argv = _interopDefault(require('minimist-argv'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var createPobpackConfig = ((target, production = false) => ({
  env: process.env.NODE_ENV,
  hmr: !production,
  includeModules: ['ynnub', 'react-alp-login'],
  paths: {
    build: target === 'node' ? 'build' : 'public'
  },
  entries: [{
    // eslint-disable-next-line no-nested-ternary
    key: target === 'node' ? 'index' : target === 'browser' ? 'es5' : 'modern-browsers',
    path: target === 'node' ? 'index.server.js' : 'index.browser.js'
  }],
  resolveLoaderModules: [path.join(__dirname, '../..', 'node_modules'), 'node_modules'],
  babel: {
    minified: target !== 'node' && production,
    comments: !(target !== 'node' && production),
    presets: [// flow
    presetFlow, // add react preset with jsx
    [presetReact, {
      development: !production,
      useBuiltIns: true
    }], // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
    [presetPobEnv, {
      resolvePreset: preset => require.resolve(preset),
      production,
      typescript: false,
      exportDefaultName: false,
      optimizations: true,
      target: target === 'node' ? 'node' : 'browser',
      // eslint-disable-next-line no-nested-ternary
      version: target === 'node' ? 8.3 : target === 'modern-browser' ? 'modern' : undefined,
      loose: false,
      modules: false,
      replacements: {
        BROWSER: target !== 'node',
        NODEJS: target === 'node',
        SERVER: target === 'node',
        MODERN_BROWSERS: target === 'modern-browser'
      }
    }]].filter(Boolean),
    plugins: [require.resolve('babel-plugin-react-require'), require.resolve('babel-plugin-inline-classnames')]
  },
  moduleRules: [// SCSS RULE, CSS RULE
  ...webpackConfig.createModuleRules({
    MiniCssExtractPlugin,
    production,
    themeFile: './src/theme.scss',
    plugins: [autoprefixer],
    includePaths: [path.resolve('./node_modules')],
    resolveLoader: loader => require.resolve(loader)
  }), // IMG RULE
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
      emitFile: target === 'node',
      // only write file if node
      limit: 1000,
      name: 'images/[hash].[ext]',
      outputPath: '../public/',
      // because it's node who is writing the file, node is in build/
      publicPath: url => url.replace(/^..\/public\//, '')
    }
  }],
  plugins: [webpackConfig.createExtractPlugin(MiniCssExtractPlugin, {
    // disable: target === 'node',
    filename: `${// eslint-disable-next-line no-nested-ternary
    target === 'node' ? 'server' : target === 'browser' ? 'es5' : 'modern-browsers'}.css`
  }), new OptimizeCssAssetsPlugin(), target !== 'node' && production && new BabelMinifyPlugin({
    booleans: true,
    builtIns: false,
    consecutiveAdds: true,
    deadcode: true,
    evaluate: true,
    flipComparisons: true,
    guards: true,
    infinity: false,
    mangle: true,
    memberExpressions: true,
    mergeVars: true,
    numericLiterals: true,
    propertyLiterals: true,
    regexpConstructors: true,
    removeConsole: false,
    removeDebugger: true,
    removeUndefined: true,
    replace: false,
    simplify: true,
    simplifyComparisons: true,
    typeConstructors: true,
    undefinedToVoid: false // keepFnName: true,
    // keepClassName: true,

  }, {
    comments: false
  }), // target === 'browser' &&
  production && new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: !production
  })].filter(Boolean),
  defines: {
    // BROWSER: target !== 'node',
    // SERVER: target === 'node',
    // NODEJS: target === 'node',
    // PRODUCTION: production,
    // MODERN_BROWSERS: target === 'modern-browser',
    'process.env.ALP_TARGET': target
  }
}));

const createModernBrowserCompiler = production => pobpackBrowser.createAppBrowserCompiler(pobpackBrowser.MODERN, createPobpackConfig('modern-browser', production));
const runDevServer = (compiler, port, proxyPort, options) => pobpackBrowser.runDevServer(compiler, _objectSpread({
  port: proxyPort,
  https: false,
  // contentBase: false,
  headers: {
    // avoid errors in console
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap'
  },
  proxy: {
    '**': `http://localhost:${port}`
  }
}, options));

const browserCompiler = createModernBrowserCompiler();
runDevServer(browserCompiler, argv.port, argv['proxy-port'], {
  host: argv.host
});
//# sourceMappingURL=watch-browser-node8-dev.cjs.js.map
