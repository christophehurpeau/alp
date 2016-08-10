'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = exports.build = exports.clean = undefined;

var _pobBabel = require('pob-babel');

Object.defineProperty(exports, 'clean', {
  enumerable: true,
  get: function get() {
    return _pobBabel.clean;
  }
});
Object.defineProperty(exports, 'build', {
  enumerable: true,
  get: function get() {
    return _pobBabel.build;
  }
});
Object.defineProperty(exports, 'watch', {
  enumerable: true,
  get: function get() {
    return _pobBabel.watch;
  }
});


(0, _pobBabel.registerPlugin)(require('./pob-build-plugins/yml'));
//# sourceMappingURL=pob-build.js.map