const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const createBabelOpts = require('pob-babel/lib/babel-options');
const BabiliCustomPlugin = require('./BabiliCustomWebpackPlugin');

const production = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
const dest = process.env.WEBPACK_DEST || 'modern-browsers';
const modernBrowsers = dest === 'modern-browsers';
// const modernBrowsers = false;

const env = `webpack${modernBrowsers ? '-modern-browsers' : ''}${!production ? '-dev' : ''}`;
const babelOptions = createBabelOpts(env, true);

const resolvePreset = presetName => require.resolve(`babel-preset-${presetName}`);
const resolvePlugin = pluginName => require.resolve(`babel-plugin-${pluginName}`);
const resolveBabel = resolve => thing => {
  if (Array.isArray(thing)) return [resolveBabel(resolve)(thing[0])].concat(thing.slice(1));
  if (typeof thing === 'string' && !thing.startsWith('/')) return resolve(thing);
  return thing;
};

const modulesList = (() => {
  try {
    return fs.readdirSync(path.resolve('src/modules'));
  } catch (e) {
    return [];
  }
})();

module.exports = {
  devtool: production ? undefined : 'cheap-source-map',
  bail: true,

  entry: {
    [dest]: [
      !modernBrowsers && 'babel-regenerator-runtime',
      !production && 'webpack-hot-middleware/client',
      !production && 'react-hot-loader/patch',
      './src/index.browser.js',
    ].filter(Boolean),
  },

  output: {
    path: path.resolve('public'),
    publicPath: '/',
    filename: '[name].js',
    pathinfo: !production,
  },

  module: {
    // Disable handling of unknown requires
    unknownContextRegExp: /$^/,
    unknownContextCritical: false,

    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false,

    // Disable handling of expression in require
    wrappedContextRegExp: /$^/,
    wrappedContextCritical: false,
    wrappedContextRecursive: false,


    // preLoaders: [
    // { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ },
    // { test: /\.jsx?$/, loader: 'source-map', exclude: /react-hot-loader/ }
    // ],

    rules: [
      // JS / JSX RULE
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        exclude: /\.server\.jsx?$/,
        loader: require.resolve('babel-loader'),
        options: {
          compact: production,
          minified: production,
          comments: !production,
          presets: babelOptions.presets.map(resolveBabel(resolvePreset)),
          plugins: babelOptions.plugins.map(resolveBabel(resolvePlugin)),
        },
      },
      // CSS / STYL RULE
      {
        test: /\.css$/,
        include: path.resolve('src'),
        loader: ExtractTextPlugin.extract({
          loader: [require.resolve('css-loader')],
        }),
      },
      {
        test: /\.styl$/,
        include: path.resolve('src'),
        loader: ExtractTextPlugin.extract({
          loader: [
            // eslint-disable-next-line prefer-template
            require.resolve('css-loader') + '?modules&importLoaders=1'
              + '&localIdentName=[name]__[local]__[hash:base64:5]',
              // + `localIdentName=${production ? : '[path][name]---[local]---[hash:base64:5]'}`,
            // eslint-disable-next-line prefer-template
            require.resolve('stylus-loader') + '?paths[]=node_modules&paths[]=src/styles',
            // {
            //   loader: require.resolve('postcss-loader'),
            //   options: {
            //     plugins: () => [require('postcss-modules')],
            //   }
            // },
          ],
        }),
      },
    ].filter(Boolean),
  },

  resolveLoader: {
    modules: ['node_modules'],
  },

  resolve: {
    alias: { 'socket.io': 'socket.io-client' },
    modules: ['node_modules'],
    extensions: ['.browser.js', '.js', '.browser.jsx', '.jsx', '.json'],
    mainFields: [
      modernBrowsers && !production && 'webpack:main-modern-browsers-dev',
      modernBrowsers && 'webpack:main-modern-browsers',
      !production && 'webpack:main-dev',
      'webpack:main',
      !production && 'browser-dev',
      'browser',
      !production && 'main-dev',
      'webpack',
      'main',
    ].filter(Boolean),
    aliasFields: [
      modernBrowsers && !production && 'webpack:aliases-modern-browsers-dev',
      modernBrowsers && 'webpack:aliases-modern-browsers',
      !production && 'webpack:aliases-dev',
      'webpack:aliases',
      'webpack',
      'browser',
    ].filter(Boolean),
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: dest,
      filename: `${dest}.js`,
      chunks: [dest],
      // minChunks: modulesList.length === 1 ? 1 : 2,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: !production,
      minimize: production,
      /*
      doing that makes postcss-modules base64 different between server and webpack stylus: {
      options: {
          set: {
            paths: ['src/styles', 'node_modules'],
          },
        },
      }, */
    }),
    new webpack.DefinePlugin({
      BROWSER: true,
      SERVER: false,
      NODEJS: false,
      PRODUCTION: production,
      MODERN_BROWSERS: modernBrowsers,
      'process.env': {
        NODE_ENV: JSON.stringify(production ? 'production' : process.env.NODE_ENV),
      },
    }),
    !production && new webpack.HotModuleReplacementPlugin(),
    !production && new webpack.NoErrorsPlugin(),
    production && new BabiliCustomPlugin({
      comments: false,
      plugins: [
        [
          'minify-replace',
          [
            ['BROWSER', true],
            ['SERVER', false],
            ['NODEJS', false],
            ['PRODUCTION', production],
            ['MODERN_BROWSERS', modernBrowsers],
          ].map(([key, value]) => ({
            identifierName: key,
            replacement: { type: 'booleanLiteral', value: value },
          })),
        ],
        'minify-dead-code-elimination',
        'minify-flip-comparisons',
        'minify-guarded-expressions',
        'minify-constant-folding',
        'minify-numeric-literals',
        'minify-simplify',
        'minify-empty-function',
        'transform-member-expression-literals',
        'transform-merge-sibling-variables',
        'transform-property-literals',
        'transform-remove-debugger',
        'minify-mangle-names',
      ].map(resolveBabel(resolvePlugin)),
    }),
    production && !modernBrowsers && new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: !production,
    }),
    // TODO https://github.com/NekR/offline-plugin
  ].filter(Boolean),
};
