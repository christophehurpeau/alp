var production = process.env.NODE_ENV === 'production' || (process.argv0 && process.argv0 !== process.argv[0]);
return module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/');
