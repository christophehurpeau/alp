var production = process.env.NODE_ENV === 'production';
module.exports = require('./dist/build-node8' + (production ? '' : '-dev') + '.cjs');
