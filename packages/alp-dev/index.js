var production = process.env.NODE_ENV === 'production';
module.exports = require('./lib-node8' + (production ? '' : '-dev') + '/index');
