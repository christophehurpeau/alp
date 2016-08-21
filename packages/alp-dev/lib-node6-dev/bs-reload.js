'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reload;

var _browserSync = require('./browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _reloadTimeout;

function reload() {
  if (_reloadTimeout) clearTimeout(_reloadTimeout);
  _reloadTimeout = setTimeout(() => {
    return _browserSync2.default.reload();
  }, 1000);
}
//# sourceMappingURL=bs-reload.js.map