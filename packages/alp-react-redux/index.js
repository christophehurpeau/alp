var production = process.env.NODE_ENV === 'production';
return module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/node');
throw new Error('Platform not supported: ' + process.version + '.');
