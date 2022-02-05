import nodeFetch from 'node-fetch';

// @ts-expect-error -- node-fetch does not exactly match dom api
global.fetch = nodeFetch;

// eslint-disable-next-line unicorn/prefer-export-from
export default nodeFetch;
