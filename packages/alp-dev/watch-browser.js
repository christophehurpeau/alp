const production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/watch-browser-node10' + (production ? '' : '-dev') + '.cjs');
