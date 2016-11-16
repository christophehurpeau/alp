'use strict';

var _writeFile = require('pob-babel/lib/utils/writeFile');

var _writeFile2 = _interopRequireDefault(_writeFile);

var _path = require('path');

var _loadConfigFile = require('../utils/loadConfigFile');

var _loadConfigFile2 = _interopRequireDefault(_loadConfigFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  extension: 'yml',
  destExtension: 'json',

  transform(content, { src }) {
    let [serverConfig, browserConfig] = (0, _loadConfigFile2.default)(content, (0, _path.dirname)(src));

    return (0, _writeFile2.default)(`public/${ src.slice('src/'.length, -'yml'.length) }json`, JSON.stringify(browserConfig)).then(() => ({ code: JSON.stringify(serverConfig), map: null }));
  }
};
//# sourceMappingURL=yml.js.map