import nodeFetch from 'node-fetch';
export { default } from 'node-fetch';

// @ts-expect-error -- node-fetch does not exactly match dom api
global.fetch = nodeFetch;
//# sourceMappingURL=fetch-node14.mjs.map
