import nodeFetch from 'node-fetch';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var fetch: typeof nodeFetch;
}

global.fetch = nodeFetch;

// eslint-disable-next-line unicorn/prefer-export-from
export default nodeFetch;
