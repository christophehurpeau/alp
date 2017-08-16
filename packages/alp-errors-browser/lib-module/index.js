function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

var logger = new Logger('alp:errors');
var errorHtmlRenderer = new ErrorHtmlRenderer();

export default (function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      for (;;) switch (_context.prev = _context.next) {
        case 0:
          return _context.prev = 0, _context.next = 3, next();

        case 3:
          _context.next = 12;
          break;

        case 5:
          if (_context.prev = 5, _context.t0 = _context['catch'](0), (_context.t0 || (_context.t0 = new Error('Unknown error')), typeof _context.t0 === 'string' && (_context.t0 = new Error(_context.t0)), ctx.status = _context.t0.status || 500, logger.error(_context.t0), !_context.t0.expose)) {
            _context.next = 11;
            break;
          }

          ctx.body = _context.t0.message, _context.next = 12;
          break;

        case 11:
          throw _context.t0;

        case 12:
        case 'end':
          return _context.stop();
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map