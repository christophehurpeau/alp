const production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/hot-node10' + (production ? '' : '-dev') + '.cjs');
