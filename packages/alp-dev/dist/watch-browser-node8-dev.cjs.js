'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var presetPob = _interopDefault(require('babel-preset-pob'));
var presetPobReact = _interopDefault(require('babel-preset-pob-react'));
var presetPobStages = _interopDefault(require('babel-preset-pob-stages'));
var presetEnv = _interopDefault(require('babel-preset-env'));
var babelPresetModernBrowsers = require('babel-preset-modern-browsers');
var presetLatestNode = _interopDefault(require('babel-preset-latest-node'));
var presetOptimizations = _interopDefault(require('babel-preset-optimizations'));
var pluginDiscardModuleReference = _interopDefault(require('babel-plugin-discard-module-references'));
var pluginFlowRuntime = _interopDefault(require('babel-plugin-flow-runtime'));
var OptimizeCssAssetsPlugin = _interopDefault(require('optimize-css-assets-webpack-plugin'));
var BabelMinifyPlugin = _interopDefault(require('babel-minify-webpack-plugin'));
var webpack = require('webpack');
var MiniCssExtractPlugin = _interopDefault(require('mini-css-extract-plugin'));
var autoprefixer = _interopDefault(require('autoprefixer'));
var webpackConfig = require('ynnub/webpack-config');
var t = _interopDefault(require('flow-runtime'));
var pobpackBrowser = require('pobpack-browser');
var argv = _interopDefault(require('minimist-argv'));

const TargetType = t.type('TargetType', t.union(t.string('node'), t.string('modern-browser'), t.string('browser')));


var createPobpackConfig = ((target, production = false) => {
  let _productionType = t.nullable(t.boolean());

  t.param('target', TargetType).assert(target);
  t.param('production', _productionType).assert(production);
  return {
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

      // preset order is last to first, so we reverse it for clarity.
      presets: [target === 'node' && [presetLatestNode, {
        modules: false,
        target: 8.3
      }], target === 'browser' && [presetEnv, {
        modules: false,
        useBuiltIns: true,
        targets: ['>1%', 'not ie < 9']
      }],
      // transpile for browser
      target === 'modern-browser' && [babelPresetModernBrowsers.buildPreset, { modules: false }],
      // discard unused imports (like production-only or node-only imports)
      { plugins: [pluginDiscardModuleReference] },
      // flow runtime
      !production && {
        plugins: [[pluginFlowRuntime, {
          assert: true,
          annotate: false
        }]]
      },
      // optimizations: remove dead-code
      presetOptimizations,
      // pob preset: flow, import `src`, export default function name, replacements
      [presetPob, {
        production,
        replacements: {
          BROWSER: target !== 'node',
          NODEJS: target === 'node',
          SERVER: target === 'node',
          MODERN_BROWSERS: target === 'modern-browser'
        }
      }],
      // add stage-1 to stage-3 features
      presetPobStages,
      // add react preset with jsx
      [presetPobReact, { production }]].filter(Boolean),
      plugins: []
    },

    moduleRules: [
    // SCSS RULE, CSS RULE
    ...webpackConfig.createModuleRules({
      MiniCssExtractPlugin,
      production,
      themeFile: './src/theme.scss',
      plugins: [autoprefixer],
      includePaths: [path.resolve('./node_modules')]
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

    plugins: [webpackConfig.createExtractPlugin(MiniCssExtractPlugin, {
      // disable: target === 'node',
      filename: `${
      // eslint-disable-next-line no-nested-ternary
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
      undefinedToVoid: false
      // keepFnName: true,
      // keepClassName: true,
    }, { comments: false }), target === 'browser' && production && new webpack.optimize.UglifyJsPlugin({
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
  };
});

const createModernBrowserCompiler = production => pobpackBrowser.createAppBrowserCompiler(pobpackBrowser.MODERN, createPobpackConfig('modern-browser', production));

const runDevServer = (compiler, port, proxyPort, options) => {
  let _portType = t.number();

  let _proxyPortType = t.number();

  t.param('port', _portType).assert(port);
  t.param('proxyPort', _proxyPortType).assert(proxyPort);
  return pobpackBrowser.runDevServer(compiler, Object.assign({
    port: proxyPort,
    https: false,

    // contentBase: false,

    headers: {
      'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap'
    },

    proxy: {
      '**': `http://localhost:${port}`
    }

  }, options));
};

const browserCompiler = createModernBrowserCompiler();

runDevServer(browserCompiler, argv.port, argv['proxy-port'], {
  host: argv.host
});
//# sourceMappingURL=watch-browser-node8-dev.cjs.js.map
