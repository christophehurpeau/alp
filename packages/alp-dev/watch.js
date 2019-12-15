const production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/watch-node10' + (production ? '' : '-dev') + '.cjs');
