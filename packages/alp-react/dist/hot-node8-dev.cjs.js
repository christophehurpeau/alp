'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable import/no-extraneous-dependencies, import/no-commonjs, global-require */
const productionHot = a => a;

const devHot = () => {
  const hotLoader = require('react-hot-loader/dist/react-hot-loader.development.js').hot;

  const cache = require.cache; // @ts-ignore

  if (!module.parents || !module.parents[0]) {
    throw new Error('alp-react: hot is not supported on your system.');
  } // access parent
  // @ts-ignore


  const parent = cache[module.parents[0]]; // remove itself from a cache

  delete cache[module.id]; // setup hot for caller

  return hotLoader(Object.assign({
    id: parent.i
  }, parent));
};

const hot = module.hot ? devHot() : productionHot;

exports.hot = hot;
//# sourceMappingURL=hot-node8-dev.cjs.js.map
