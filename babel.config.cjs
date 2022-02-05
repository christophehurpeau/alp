'use strict';

module.exports = function babelConfig(api) {
  const isTest = api.env('test');

  if (!isTest) return {};

  return {
    only: ['packages/*/src', 'packages/*/lib'],
    presets: [
      [require.resolve('pob-babel/preset.cjs')],
      [
        '@babel/preset-react',
        {
          development: false,
          useBuiltIns: true,
        },
      ],
      ['@linaria/babel-preset'],
    ],
  };
};
