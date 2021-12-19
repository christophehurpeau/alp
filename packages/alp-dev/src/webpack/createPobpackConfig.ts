/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, complexity, max-lines */

import fs from 'fs';
import path from 'path';
import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import type { Options } from '../pobpack/types';
import { createModuleRules, createCssModuleUse } from './css-module-rules';

// stylesCacheGroups

type TargetType = 'node' | 'modern-browser' | 'browser';

const ExcludesFalsy = (Boolean as any) as <T>(
  x: T | false | null | undefined,
) => x is T;

export default function createPobpackConfig(
  target: TargetType,
  production = false,
): Partial<Options> {
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve('package.json'), 'utf-8'),
  );
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

    allowlistExternalExtensions: [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'svg',
      'scss',
      'css',
    ],

    paths: {
      build: target === 'node' ? 'build' : 'public',
    },

    entries: [
      {
        key:
          target === 'node'
            ? 'index'
            : // eslint-disable-next-line unicorn/no-nested-ternary
            target === 'browser'
            ? 'es5'
            : 'modern-browsers',
        path: target === 'node' ? 'index.server.ts' : 'index.browser.ts',
      },
    ],

    resolveLoaderModules: [
      path.join(__dirname, '../..', 'node_modules'),
      'node_modules',
    ],

    babel: {
      minified: target !== 'node' && production,
      comments: !(target !== 'node' && production),

      presets: [
        // add react preset with jsx
        [
          require.resolve('@babel/preset-react'),
          { development: !production, useBuiltIns: true, runtime: 'automatic' },
        ],
        // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
        [
          require.resolve('babel-preset-pob-env'),
          {
            resolvePreset: (preset: string): string => require.resolve(preset),
            production,
            typescript: true,
            optimizations: true,
            target: target === 'node' ? 'node' : 'browser',
            version:
              target === 'node'
                ? '12.10'
                : // eslint-disable-next-line unicorn/no-nested-ternary
                target === 'modern-browser'
                ? 'modern'
                : undefined,
            loose: true,
            modules: false,
          },
        ],
      ],
      plugins: [
        require.resolve('babel-plugin-inline-classnames-babel7'),
        hasAntd && [
          require.resolve('babel-plugin-import'),
          {
            libraryName: 'antd',
            libraryDirectory: target === 'node' ? 'lib' : 'es',
            style: target !== 'node',
          },
        ],
      ].filter(ExcludesFalsy),
    },

    moduleRules: [
      // SCSS RULE, CSS RULE
      ...createModuleRules({
        target,
        extractLoader: {
          loader: MiniCssExtractPlugin.loader,
          options: { esModule: true },
        },
        production,
        themeFile: './src/theme.scss',
        plugins: [autoprefixer],
        includePaths: [path.resolve('./node_modules')],
      }),

      // LESS RULE (antd)
      {
        test: /\.less$/,
        use: createCssModuleUse({
          global: true,
          target,
          extractLoader: {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../..' },
          },
          production,
          plugins: [autoprefixer],
          otherLoaders: [
            {
              loader: require.resolve('less-loader'),
              options: {
                javascriptEnabled: true,
                // modifyVars: path.resolve('./src/less-modifyVars.js'),
              },
            },
            {
              loader: require.resolve('less-modify-var-loader'),
              options: {
                filePath: path.resolve('./src/theme.less'),
              },
            },
          ],
        }),
      },

      // IMG RULE
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024, // 1kb
          },
        },
      },
    ],

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

    plugins: [
      new MiniCssExtractPlugin({
        experimentalUseImportModule: true,
        filename: `${
          target === 'node'
            ? 'server'
            : // eslint-disable-next-line unicorn/no-nested-ternary
            target === 'browser'
            ? 'es5'
            : 'modern-browsers'
        }.css`, // [name].[contenthash:8].css
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        runtime: target !== 'node',
      }),

      process.send &&
        new webpack.ProgressPlugin(
          (percentage: number, message: string): void => {
            (process.send as NonNullable<typeof process.send>)({
              type: 'webpack-progress',
              percentage,
              message,
            });
          },
        ),

      // TODO https://github.com/NekR/offline-plugin
    ].filter(ExcludesFalsy),
  };
}
