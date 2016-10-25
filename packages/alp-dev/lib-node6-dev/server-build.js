'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = exports.build = exports.clean = undefined;

var _pobBabel = require('pob-babel');

(0, _pobBabel.registerPlugin)(require('./pob-build-plugins/yml'));
(0, _pobBabel.registerPlugin)(require('./pob-build-plugins/stylus'));

const options = {
  babelExtensions: ['.js', '.jsx']
};

const clean = exports.clean = envs => (0, _pobBabel.clean)(envs);
const build = exports.build = envs => (0, _pobBabel.build)(envs, options);
const watch = exports.watch = envs => (0, _pobBabel.watch)(envs, options);
//# sourceMappingURL=server-build.js.map