'use strict';

const path = require('path');
const loadConfigFile = require('../utils/loadConfigFile');

module.exports = {
  extension: 'yml',
  destExtension: 'json',

  transform(content, _ref) {
    let src = _ref.src;

    let config = loadConfigFile(content, 'server', path.dirname(src));

    return { code: JSON.stringify(config), map: null };
  }
};
//# sourceMappingURL=yml.js.map