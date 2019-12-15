const production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/build-modern-browser-node10' + (production ? '' : '-dev') + '.cjs');
