var production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/watch-node8' + (production ? '' : '-dev') + '.cjs');
