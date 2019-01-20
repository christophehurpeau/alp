import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var logger = new Logger('alp:errors');
var errorHtmlRenderer = new ErrorHtmlRenderer();

var createErrorInstanceIfNeeded = function createErrorInstanceIfNeeded(err) {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
  return err;
};

var errorMiddleware =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(ctx, next) {
    var errInstance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _context.next = 15;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            errInstance = createErrorInstanceIfNeeded(_context.t0);
            ctx.status = errInstance.status ? errInstance.status : 500;
            logger.error(errInstance);

            if (!errInstance.expose) {
              _context.next = 14;
              break;
            }

            ctx.body = errInstance.message;
            _context.next = 15;
            break;

          case 14:
            throw errInstance;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function errorMiddleware() {
    return _ref.apply(this, arguments);
  };
}();

export default errorMiddleware;
//# sourceMappingURL=index-browser.es.js.map
