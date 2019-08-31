/* eslint-disable import/no-extraneous-dependencies, import/no-commonjs, global-require */
import { PRODUCTION } from 'pob-babel';
import { ComponentType } from 'react';

type Hot = <T = ComponentType<any>>(Component: T) => T;

const productionHot: Hot = (a) => a;

const devHot = () => {
  const hotLoader = require('react-hot-loader/dist/react-hot-loader.development.js')
    .hot;
  const cache = require.cache;

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (!module.parents || !module.parents[0]) {
    throw new Error('alp-react: hot is not supported on your system.');
  }
  // access parent
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const parent = cache[module.parents[0]];
  // remove itself from a cache
  delete cache[module.id];

  // setup hot for caller
  return hotLoader({ id: parent.i, ...parent });
};

export const hot = (!PRODUCTION && module.hot
  ? devHot()
  : productionHot) as Hot;
