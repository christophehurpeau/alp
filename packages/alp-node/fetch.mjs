import fetch from 'node-fetch';

global.fetch = fetch;

// eslint-disable-next-line unicorn/prefer-export-from
export default fetch;
