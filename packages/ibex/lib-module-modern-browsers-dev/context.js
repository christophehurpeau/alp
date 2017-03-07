import delegate from 'delegates';

const proto = {};

delegate(proto, 'response').access('body').method('redirect');

delegate(proto, 'request').getter('host').getter('hostname').getter('href').getter('origin').getter('path').getter('protocol').getter('query').getter('url').getter('search').getter('searchParams');

export default proto;
//# sourceMappingURL=context.js.map