'use strict';

var _path = require('path');

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _child_process = require('child_process');

var _configBuild = require('../config-build');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _child_process.execSync)(`rm -Rf ${(0, _path.resolve)('public')}/* ${(0, _path.resolve)('build')}/*`);

(0, _configBuild.clean)();
(0, _configBuild.build)();

Promise.all(['./node', './modern-browser', './older-browser'].map(path => {
  const instance = (0, _execa2.default)('node', [require.resolve(path)]);
  instance.stdout.pipe(process.stdout);
  return instance;
})).then(() => {
  console.log('done !');
});
//# sourceMappingURL=index.js.map