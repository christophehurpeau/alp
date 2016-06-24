var production = process.env.NODE_ENV === 'production';
return module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/');
// help autocomplete
return module.exports = require('./src/');
