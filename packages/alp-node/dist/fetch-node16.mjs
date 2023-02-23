import nodeFetch from 'node-fetch';
export { default } from 'node-fetch';

// TODO remove with node 18 since is native
// https://nodejs.org/en/blog/announcements/v18-release-announce/

// @ts-expect-error -- node-fetch does not exactly match dom api
global.fetch = nodeFetch;
//# sourceMappingURL=fetch-node16.mjs.map
