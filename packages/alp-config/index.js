var production = process.env.NODE_ENV === 'production';
if (process.version.startsWith && process.version.startsWith('6.'))
    return module.exports = require('./dist/node6' + (production ? '' : '-dev') + '/');
if (process.version.startsWith && process.version.startsWith('5.'))
    return module.exports = require('./dist/node5' + (production ? '' : '-dev') + '/');
throw new Error('Platform not supported.');
