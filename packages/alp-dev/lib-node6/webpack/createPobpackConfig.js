'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelPresetPob = require('babel-preset-pob');

var _babelPresetPob2 = _interopRequireDefault(_babelPresetPob);

var _babelPresetPobReact = require('babel-preset-pob-react');

var _babelPresetPobReact2 = _interopRequireDefault(_babelPresetPobReact);

var _babelPresetPobStages = require('babel-preset-pob-stages');

var _babelPresetPobStages2 = _interopRequireDefault(_babelPresetPobStages);

var _babelPresetEnv = require('babel-preset-env');

var _babelPresetEnv2 = _interopRequireDefault(_babelPresetEnv);

var _babelPresetModernBrowsers = require('babel-preset-modern-browsers');

var _babelPresetBabiliOptimizations = require('babel-preset-babili-optimizations');

var _babelPresetBabiliOptimizations2 = _interopRequireDefault(_babelPresetBabiliOptimizations);

var _babelPluginDiscardModuleReferences = require('babel-plugin-discard-module-references');

var _babelPluginDiscardModuleReferences2 = _interopRequireDefault(_babelPluginDiscardModuleReferences);

var _babelPluginFlowRuntime = require('babel-plugin-flow-runtime');

var _babelPluginFlowRuntime2 = _interopRequireDefault(_babelPluginFlowRuntime);

var _webpackConfig = require('ynnub/webpack-config');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _babiliWebpackPlugin = require('babili-webpack-plugin');

var _babiliWebpackPlugin2 = _interopRequireDefault(_babiliWebpackPlugin);

var _webpack = require('webpack');

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (target, production = false) => ({
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

  resolveLoaderModules: [_path2.default.join(__dirname, '../..', 'node_modules'), 'node_modules'],

  babel: {
    minified: target !== 'node' && production,
    comments: !(target !== 'node' && production),

    // preset order is last to first, so we reverse it for clarity.
    presets: [
    // add react preset with jsx
    [_babelPresetPobReact2.default, { production }],
    // add stage-1 to stage-3 features
    _babelPresetPobStages2.default,
    // pob preset: flow, import `src`, export default function name, replacements
    [_babelPresetPob2.default, {
      production,
      replacements: {
        BROWSER: target !== 'node',
        NODEJS: target === 'node',
        SERVER: target === 'node',
        MODERN_BROWSERS: target === 'modern-browser'
      }
    }],
    // optimizations: remove dead-code
    _babelPresetBabiliOptimizations2.default,
    // flow runtime
    !production && {
      plugins: [[_babelPluginFlowRuntime2.default, {
        assert: true,
        annotate: false
      }]]
    },
    // discard unused imports (like production-only or node-only imports)
    { plugins: [_babelPluginDiscardModuleReferences2.default] },
    // transpile for browser
    target === 'modern-browser' && [_babelPresetModernBrowsers.buildPreset, { modules: false }], target === 'browser' && [_babelPresetEnv2.default, {
      modules: false,
      useBuiltIns: true,
      targets: ['>1%', 'not ie < 9']
    }]].reverse().filter(Boolean),
    plugins: []
  },

  moduleRules: [
  // SCSS RULE
  (0, _webpackConfig.createModuleRule)(_extractTextWebpackPlugin2.default, {
    production,
    themeFile: './src/theme.scss',
    plugins: [_autoprefixer2.default]
  }),

  // IMG RULE
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
      emitFile: target === 'node', // only write file if node
      limit: 1000,
      name: 'images/[hash].[ext]',
      outputPath: '../public/', // because it's node who is writing the file, node is in build/
      publicPath: url => url.replace(/^..\/public\//, '')
    }
  }],

  plugins: [(0, _webpackConfig.createExtractPlugin)(_extractTextWebpackPlugin2.default, {
    // disable: target === 'node',
    filename: `${target === 'browser' ? 'es5' : 'modern-browsers'}.css`
  }), target !== 'node' && production && new _babiliWebpackPlugin2.default({
    comments: false,
    evaluate: true, // babel-plugin-minify-constant-folding
    deadcode: true, // babel-plugin-minify-dead-code-elimination
    infinity: false, // babel-plugin-minify-infinity
    mangle: true, // babel-plugin-minify-mangle-names
    numericLiterals: true, // babel-plugin-minify-numeric-literals
    replace: false, // babel-plugin-minify-replace
    simplify: true, // babel-plugin-minify-simplify
    mergeVars: false, // babel-plugin-transform-merge-sibling-variables
    booleans: false, // babel-plugin-transform-minify-booleans
    regexpConstructors: true, // babel-plugin-transform-regexp-constructors
    removeConsole: false, // babel-plugin-transform-remove-console
    removeDebugger: true, // babel-plugin-transform-remove-debugger
    removeUndefined: true, // babel-plugin-transform-remove-undefined
    undefinedToVoid: false, // babel-plugin-transform-undefined-to-void
    unsafe: {
      flipComparisons: true,
      simplifyComparisons: true,
      guards: true,
      typeConstructors: true
    },
    properties: {
      memberExpressions: true,
      propertyLiterals: true
    }
  }), target === 'browser' && production && new _webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: !production
  })].filter(Boolean),

  defines: {
    BROWSER: target !== 'node',
    SERVER: target === 'node',
    NODEJS: target === 'node',
    PRODUCTION: production,
    MODERN_BROWSERS: target === 'modern-browser'
  }
});
//# sourceMappingURL=createPobpackConfig.js.map