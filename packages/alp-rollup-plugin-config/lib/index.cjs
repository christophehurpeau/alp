'use strict';

const { copy } = require('@guanghechen/rollup-plugin-copy');
const { load } = require('js-yaml');

module.exports = (options) =>
  copy({
    ...options,
    targets: options.targets.map((targetOptions) => ({
      dest: 'build/config',
      rename: (name, extension) => `${name}.json`,
      transform: (contents, srcPath, destPath) =>
        JSON.stringify(load(contents)).toString(),
      ...targetOptions,
    })),
    flatten: false,
  });
