var production = process.env.NODE_ENV === 'production';
module.exports = require('./es5' + (production ? '' : '-dev') + '/');
