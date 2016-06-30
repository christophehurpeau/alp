import delegate from 'delegates';

var proto = {};

delegate(proto, 'request').access('host').access('hostname').access('href').access('origin').access('path').access('protocol').access('query').access('url').access('search').access('searchParams');

export default proto;
//# sourceMappingURL=context.js.map