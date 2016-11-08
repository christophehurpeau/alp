'use strict';

var _path = require('path');

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssModules = require('postcss-modules');

var _postcssModules2 = _interopRequireDefault(_postcssModules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const stylesPath = `styles${ _path.sep }`;

module.exports = {
  extension: 'styl',
  // destExtension: 'css',
  destExtension: 'styl.js',

  transform(content, _ref) {
    let src = _ref.src;
    let relative = _ref.relative;
    let cwd = _ref.cwd;

    const fileName = (0, _path.basename)(relative);
    if (fileName.startsWith('_')) return;

    if (relative.startsWith(stylesPath)) {
      if (relative.substr(stylesPath.length).includes(_path.sep)) return;

      return new Promise((resolve, reject) => {
        const style = (0, _stylus2.default)(content.toString()).set('filename', src).set('paths', ['node_modules']).set('sourcemap', { comment: true });

        style.render((err, css) => {
          if (err) return reject(err);

          resolve({ code: css, map: style.sourcemap });
        });
      });
    }

    return new Promise((resolve, reject) => {
      const stylesPath = (0, _path.join)(cwd, 'src', 'styles');
      (0, _stylus2.default)(content.toString()).set('filename', src).set('paths', [stylesPath, 'node_modules']).set('sourcemap', { comment: true }).render((err, css) => {
        if (err) return reject(err);

        (0, _postcss2.default)([(0, _postcssModules2.default)({
          generateScopedName: '[name]__[local]__[hash:base64:5]',
          getJSON(cssFileName, json) {
            resolve({
              code: `module.exports = ${ JSON.stringify(json) }`
            });
          }
        })]).process(css, { from: src }).catch(err => reject(err));
      });
    });
  }
};
//# sourceMappingURL=stylus.js.map