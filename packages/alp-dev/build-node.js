const production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/build-node-node10' + (production ? '' : '-dev') + '.cjs');
