import path from 'path';
import presetPob from 'babel-preset-pob';
import presetPobReact from 'babel-preset-pob-react';
import presetPobStages from 'babel-preset-pob-stages';
import presetEnv from 'babel-preset-env';
import { buildPreset as presetModernBrowsers } from 'babel-preset-modern-browsers';
import presetBabiliOptimizations from 'babel-preset-babili-optimizations';
import pluginDiscardModuleReference from 'babel-plugin-discard-module-references';
import pluginFlowRuntime from 'babel-plugin-flow-runtime';
import { createModuleRule, createExtractPlugin } from 'ynnub/webpack-config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';
import { optimize } from 'webpack';
import autoprefixer from 'autoprefixer';

type TargetType = 'node' | 'modern-browser' | 'browser';

export default (target: TargetType, production: boolean = false) => ({
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

    // preset order is last to first, so we reverse it for clarity.
    presets: [
      // add react preset with jsx
      [presetPobReact, { production }],
      // add stage-1 to stage-3 features
      presetPobStages,
      // pob preset: flow, import `src`, export default function name, replacements
      [
        presetPob,
        {
          production,
          replacements: {
            BROWSER: target !== 'node',
            NODEJS: target === 'node',
            SERVER: target === 'node',
            MODERN_BROWSERS: target === 'modern-browser',
          },
        },
      ],
      // optimizations: remove dead-code
      presetBabiliOptimizations,
      // flow runtime
      !production && {
        plugins: [
          [
            pluginFlowRuntime,
            {
              assert: true,
              annotate: false,
            },
          ],
        ],
      },
      // discard unused imports (like production-only or node-only imports)
      { plugins: [pluginDiscardModuleReference] },
      // transpile for browser
      target === 'modern-browser' && [presetModernBrowsers, { modules: false }],
      target === 'browser' && [
        presetEnv,
        {
          modules: false,
          useBuiltIns: true,
          targets: [
            '>1%',
            'not ie < 9', // react doesn't support ie < 9
          ],
        },
      ],
    ]
      .reverse()
      .filter(Boolean),
    plugins: [],
  },

  moduleRules: [
    // SCSS RULE
    createModuleRule(ExtractTextPlugin, {
      production,
      themeFile: './src/theme.scss',
      plugins: [autoprefixer],
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
    createExtractPlugin(ExtractTextPlugin, {
      disable: target === 'node',
      filename: `${target === 'browser' ? 'es5' : 'modern-browsers'}.css`,
    }),

    target !== 'node' &&
      production &&
      new BabiliPlugin({
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
        mergeVars: false,
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
      }),

    target === 'browser' &&
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