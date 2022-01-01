import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import ErrorHtmlRenderer from 'error-html';
import { Logger } from 'nightingale-logger';

var logger = new Logger('alp:errors');
var errorHtmlRenderer = (process.env.NODE_ENV !== "production") ? new ErrorHtmlRenderer() : undefined;

var createErrorInstanceIfNeeded = function createErrorInstanceIfNeeded(err) {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
  if (err instanceof Error) return err;
  return err;
};

var errorMiddleware = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(ctx, next) {
    var errInstance;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _context.next = 19;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            errInstance = createErrorInstanceIfNeeded(_context.t0);
            ctx.status = errInstance.status ? errInstance.status : 500;
            logger.error(errInstance);

            if (!errorHtmlRenderer) {
              _context.next = 14;
              break;
            }

            ctx.body = errorHtmlRenderer.render(errInstance);
            _context.next = 19;
            break;

          case 14:
            if (!errInstance.expose) {
              _context.next = 18;
              break;
            }

            ctx.body = errInstance.message;
            _context.next = 19;
            break;

          case 18:
            throw errInstance;

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 5]]);
  }));

  return function errorMiddleware() {
    return _ref.apply(this, arguments);
  };
}();

export { errorMiddleware as default };
//# sourceMappingURL=index-browser.es.js.map
