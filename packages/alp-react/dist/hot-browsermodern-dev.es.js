/* eslint-disable import/no-extraneous-dependencies, import/no-commonjs, global-require */
const productionHot = function productionHot(a) {
  return a;
};

const devHot = function devHot() {
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

export { hot };
//# sourceMappingURL=hot-browsermodern-dev.es.js.map
