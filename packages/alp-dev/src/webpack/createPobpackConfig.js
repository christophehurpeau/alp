import path from 'path';
import presetPobEnv from 'babel-preset-pob-env';
import presetReact from '@babel/preset-react';
import presetFlow from '@babel/preset-flow';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import BabelMinifyPlugin from 'babel-minify-webpack-plugin';
import { optimize } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import autoprefixer from 'autoprefixer';
import { createModuleRules, createExtractPlugin } from 'ynnub/webpack-config';

type TargetType = 'node' | 'modern-browser' | 'browser';

export default (target: TargetType, production: ?boolean = false) => ({
  env: process.env.NODE_ENV,
  hmr: !production,

  includeModules: ['ynnub', 'react-alp-login'],

  paths: {
    build: target === 'node' ? 'build' : 'public',
  },

  entries: [
    {
      // eslint-disable-next-line no-nested-ternary
      key: target === 'node' ? 'index' : target === 'browser' ? 'es5' : 'modern-browsers',
      path: target === 'node' ? 'index.server.js' : 'index.browser.js',
    },
  ],

  resolveLoaderModules: [path.join(__dirname, '../..', 'node_modules'), 'node_modules'],

  babel: {
    minified: target !== 'node' && production,
    comments: !(target !== 'node' && production),

    presets: [
      // flow
      presetFlow,
      // add react preset with jsx
      [presetReact, { development: !production, useBuiltIns: true }],
      // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
      [
        presetPobEnv,
        {
          resolvePreset: preset => require.resolve(preset),
          production,
          typescript: false,
          exportDefaultName: false,
          optimizations: true,
          target: target === 'node' ? 'node' : 'browser',
          // eslint-disable-next-line no-nested-ternary
          version: target === 'node' ? 8.3 : target === 'modern-browser' ? 'modern' : undefined,
          loose: true,
          modules: false,
          replacements: {
            BROWSER: target !== 'node',
            NODEJS: target === 'node',
            SERVER: target === 'node',
            MODERN_BROWSERS: target === 'modern-browser',
          },
        },
      ],
      // transpile for browser
      // target === 'modern-browser' && [presetModernBrowsers, { modules: false, loose: true }],
      // target === 'browser' && [
      //   presetEnv,
      //   {
      //     modules: false,
      //     loose: true,
      //     useBuiltIns: true,
      //     targets: [
      //       '>1%',
      //       'not ie < 9', // react doesn't support ie < 9
      //     ],
      //   },
      // ],
      //
      // target === 'node' && [
      //   presetLatestNode,
      //   {
      //     modules: false,
      //     loose: true,
      //     target: 8.3,
      //   },
      // ],
    ].filter(Boolean),
    plugins: [require.resolve('babel-plugin-react-require')],
  },

  moduleRules: [
    // SCSS RULE, CSS RULE
    ...createModuleRules({
      MiniCssExtractPlugin,
      production,
      themeFile: './src/theme.scss',
      plugins: [autoprefixer],
      includePaths: [path.resolve('./node_modules')],
      resolveLoader: loader => require.resolve(loader),
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
        publicPath: url => url.replace(/^..\/public\//, ''),
      },
    },
  ],

  plugins: [
    createExtractPlugin(MiniCssExtractPlugin, {
      // disable: target === 'node',
      filename: `${
        // eslint-disable-next-line no-nested-ternary
        target === 'node' ? 'server' : target === 'browser' ? 'es5' : 'modern-browsers'
      }.css`,
    }),

    new OptimizeCssAssetsPlugin(),

    target !== 'node' &&
      production &&
      new BabelMinifyPlugin(
        {
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
          undefinedToVoid: false,
          // keepFnName: true,
          // keepClassName: true,
        },
        { comments: false },
      ),

    // target === 'browser' &&
    production &&
      new optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        sourceMap: !production,
      }),
    // TODO https://github.com/NekR/offline-plugin
  ].filter(Boolean),

  defines: {
    BROWSER: target !== 'node',
    SERVER: target === 'node',
    NODEJS: target === 'node',
    PRODUCTION: production,
    MODERN_BROWSERS: target === 'modern-browser',
  },
});
