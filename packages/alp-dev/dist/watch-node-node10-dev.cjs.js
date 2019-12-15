'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const argv = _interopDefault(require('minimist-argv'));
const nightingale = require('nightingale');
const ConsoleLogger = _interopDefault(require('nightingale-console'));
const path = _interopDefault(require('path'));
const pobpackNode = require('pobpack-node');
const fs = _interopDefault(require('fs'));
const webpack = _interopDefault(require('webpack'));
const OptimizeCssAssetsPlugin = _interopDefault(require('optimize-css-assets-webpack-plugin'));
const MiniCssExtractPlugin = _interopDefault(require('mini-css-extract-plugin'));
const autoprefixer = _interopDefault(require('autoprefixer'));
const ynnubWebpackConfig = require('ynnub-webpack-config');

nightingale.addConfig({
  pattern: /^springbokjs-daemon/,
  handler: new ConsoleLogger(nightingale.Level.NOTICE),
  stop: true
}, true);

/* eslint-disable max-lines */
const ExcludesFalsy = Boolean;
function createPobpackConfig(target, production = false) {
  const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
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
    whitelistExternalExtensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'scss', 'css'],
    includeModules: [],
    paths: {
      build: target === 'node' ? 'build' : 'public'
    },
    entries: [{
      key: target === 'node' ? 'index' : // eslint-disable-next-line unicorn/no-nested-ternary
      target === 'browser' ? 'es5' : 'modern-browsers',
      path: target === 'node' ? 'index.server.ts' : 'index.browser.ts'
    }],
    resolveLoaderModules: [path.join(__dirname, '../..', 'node_modules'), 'node_modules'],
    babel: {
      minified: target !== 'node' && production,
      comments: !(target !== 'node' && production),
      presets: [// add react preset with jsx
      [require.resolve('@babel/preset-react'), {
        development: !production,
        useBuiltIns: true
      }], // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
      [require.resolve('babel-preset-pob-env'), {
        resolvePreset: preset => require.resolve(preset),
        production,
        typescript: true,
        exportDefaultName: false,
        optimizations: true,
        target: target === 'node' ? 'node' : 'browser',
        version: target === 'node' ? 8.3 : // eslint-disable-next-line unicorn/no-nested-ternary
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
    ...ynnubWebpackConfig.createModuleRules({
      target,
      extractLoader: {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: false
        }
      },
      production,
      themeFile: './src/theme.scss',
      plugins: [autoprefixer],
      includePaths: [path.resolve('./node_modules')],
      resolveLoader: loader => require.resolve(loader)
    }), // LESS RULE (antd)
    {
      test: /\.less$/,
      use: ynnubWebpackConfig.createCssModuleUse({
        global: true,
        target,
        extractLoader: {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: false
          }
        },
        production,
        plugins: [autoprefixer],
        resolveLoader: loader => require.resolve(loader),
        otherLoaders: [{
          loader: require.resolve('less-loader'),
          options: {
            javascriptEnabled: true // modifyVars: path.resolve('./src/less-modifyVars.js'),

          }
        }, {
          loader: require.resolve('less-modify-var-loader'),
          options: {
            filePath: path.resolve('./src/theme.less')
          }
        }]
      })
    }, // IMG RULE
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      loader: require.resolve('url-loader'),
      options: {
        /* config to emit with node doesn't work anymore because css is ignored by node */
        // emitFile: target === 'node', // only write file if node
        // outputPath: '../public/', // because it's node who is writing the file, node is in build/
        // publicPath: (url: string): string => url.replace(/^..\/public\//, ''),
        emitFile: target === 'modern-browser',
        limit: 1000,
        name: 'images/[hash].[ext]'
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
      // disable: target === 'node',
      filename: `${target === 'node' ? 'server' : // eslint-disable-next-line unicorn/no-nested-ternary
      target === 'browser' ? 'es5' : 'modern-browsers'}.css`
    }), new OptimizeCssAssetsPlugin(), process.send && new webpack.ProgressPlugin((percentage, message) => {
      process.send({
        type: 'webpack-progress',
        percentage,
        message
      });
    }) // target === 'browser' &&
    // target !== 'node' &&
    //   production &&
    //   new optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //     },
    //     sourcleMap: !production,
    //   }),!== 'node' &&
    //   production &&
    //   new optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //     },
    //     sourceMap: !production,
    //   }),
    // TODO https://github.com/NekR/offline-plugin
    ].filter(ExcludesFalsy)
  };
}

const createNodeCompiler = production => pobpackNode.createAppNodeCompiler(createPobpackConfig('node', production), {
  progressBar: false
});
const watchAndRun = (nodeCompiler, port) => pobpackNode.watchAndRunCompiler(nodeCompiler, {
  key: 'alp-dev:node:watchAndRun',
  displayName: 'node:watchAndRun',
  args: ['--trace-warnings', '--port', port, '--version', Date.now()],
  cwd: path.resolve('.')
});

const nodeCompiler = createNodeCompiler(false);
let watching = watchAndRun(nodeCompiler, argv.port);
process.on('SIGUSR2', () => {
  watching.close(() => {
    watching = watchAndRun(nodeCompiler, argv.port);
  });
});
//# sourceMappingURL=watch-node-node10-dev.cjs.js.map
