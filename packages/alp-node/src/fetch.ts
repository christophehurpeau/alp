import nodeFetch from 'node-fetch';

// TODO remove with node 18 since is native
// https://nodejs.org/en/blog/announcements/v18-release-announce/

// @ts-expect-error -- node-fetch does not exactly match dom api
global.fetch = nodeFetch;

// eslint-disable-next-line unicorn/prefer-export-from
export default nodeFetch;
