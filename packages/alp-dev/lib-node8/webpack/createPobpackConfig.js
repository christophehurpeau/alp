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

var _babelPresetLatestNode = require('babel-preset-latest-node');

var _babelPresetLatestNode2 = _interopRequireDefault(_babelPresetLatestNode);

var _babelPresetOptimizations = require('babel-preset-optimizations');

var _babelPresetOptimizations2 = _interopRequireDefault(_babelPresetOptimizations);

var _babelPluginDiscardModuleReferences = require('babel-plugin-discard-module-references');

var _babelPluginDiscardModuleReferences2 = _interopRequireDefault(_babelPluginDiscardModuleReferences);

var _babelPluginFlowRuntime = require('babel-plugin-flow-runtime');

var _babelPluginFlowRuntime2 = _interopRequireDefault(_babelPluginFlowRuntime);

var _optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

var _optimizeCssAssetsWebpackPlugin2 = _interopRequireDefault(_optimizeCssAssetsWebpackPlugin);

var _babelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');

var _babelMinifyWebpackPlugin2 = _interopRequireDefault(_babelMinifyWebpackPlugin);

var _webpack = require('webpack');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _webpackConfig = require('ynnub/webpack-config');

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
    presets: [target === 'node' && [_babelPresetLatestNode2.default, {
      modules: false,
      target: 8.3
    }], target === 'browser' && [_babelPresetEnv2.default, {
      modules: false,
      useBuiltIns: true,
      targets: ['>1%', 'not ie < 9']
    }],
    // transpile for browser
    target === 'modern-browser' && [_babelPresetModernBrowsers.buildPreset, { modules: false }],
    // discard unused imports (like production-only or node-only imports)
    { plugins: [_babelPluginDiscardModuleReferences2.default] },
    // flow runtime
    !production && {
      plugins: [[_babelPluginFlowRuntime2.default, {
        assert: true,
        annotate: false
      }]]
    },
    // optimizations: remove dead-code
    _babelPresetOptimizations2.default,
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
    // add stage-1 to stage-3 features
    _babelPresetPobStages2.default,
    // add react preset with jsx
    [_babelPresetPobReact2.default, { production }]].filter(Boolean),
    plugins: []
  },

  moduleRules: [
  // SCSS RULE, CSS RULE
  ...(0, _webpackConfig.createModuleRules)({
    ExtractTextPlugin: _extractTextWebpackPlugin2.default,
    production,
    themeFile: './src/theme.scss',
    plugins: [_autoprefixer2.default],
    includePaths: [_path2.default.resolve('./node_modules')]
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
    // eslint-disable-next-line no-nested-ternary
    filename: `${target === 'node' ? 'server' : target === 'browser' ? 'es5' : 'modern-browsers'}.css`
  }), new _optimizeCssAssetsWebpackPlugin2.default(), target !== 'node' && production && new _babelMinifyWebpackPlugin2.default({
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
    undefinedToVoid: false
    // keepFnName: true,
    // keepClassName: true,
  }, { comments: false }), target === 'browser' && production && new _webpack.optimize.UglifyJsPlugin({
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