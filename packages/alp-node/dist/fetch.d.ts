import nodeFetch from 'node-fetch';
declare global {
    var fetch: typeof nodeFetch;
}
export default nodeFetch;
//# sourceMappingURL=fetch.d.ts.map