import delegate from 'delegates';

const proto = {

};

delegate(proto, 'request')
    .access('host')
    .access('hostname')
    .access('href')
    .access('origin')
    .access('path')
    .access('protocol')
    .access('query')
    .access('url')
    .access('search')
    .access('searchParams');

export default proto;
