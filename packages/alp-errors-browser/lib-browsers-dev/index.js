'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errorHtml = require('error-html');

var _errorHtml2 = _interopRequireDefault(_errorHtml);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = new _nightingaleLogger2.default('alp:errors');
var errorHtmlRenderer = new _errorHtml2.default();

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _context.next = 12;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            // eslint-disable-next-line no-ex-assign
            if (!_context.t0) _context.t0 = new Error('Unknown error');
            // eslint-disable-next-line no-ex-assign
            if (typeof _context.t0 === 'string') _context.t0 = new Error(_context.t0);

            ctx.status = _context.t0.status || 500;

            logger.error(_context.t0);

            ctx.body = errorHtmlRenderer.render(_context.t0);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function index() {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=index.js.map