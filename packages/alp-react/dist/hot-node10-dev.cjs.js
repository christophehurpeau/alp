'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable import/no-extraneous-dependencies, import/no-commonjs, global-require */
const productionHot = a => a;

const devHot = () => {
  const hotLoader = require('react-hot-loader/dist/react-hot-loader.development.js').hot;

  const cache = require.cache; // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore

  if (!module.parents || module.parents.length === 0) {
    throw new Error('alp-react: hot is not supported on your system.');
  } // access parent
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore


  const parent = cache[module.parents[0]]; // remove itself from a cache

  delete cache[module.id]; // setup hot for caller

  return hotLoader(parent);
};

const hot = module.hot ? devHot() : productionHot;

exports.hot = hot;
//# sourceMappingURL=hot-node10-dev.cjs.js.map
