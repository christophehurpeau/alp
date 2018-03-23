'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = require('http');
var ErrorHtmlRenderer = _interopDefault(require('error-html'));
var Logger = _interopDefault(require('nightingale-logger'));

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
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
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: process.cwd()
});

var index = (() => {
  var _ref = asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (err) {
      // eslint-disable-next-line no-ex-assign
      if (!err) err = new Error('Unknown error');
      // eslint-disable-next-line no-ex-assign
      if (typeof err === 'string') err = new Error(err);

      ctx.status = err.status || 500;
      logger.error(err);

      switch (ctx.accepts('html', 'text', 'json')) {
        case 'text':
          ctx.type = 'text/plain';
          if (process.env.NODE_ENV !== 'production') {
            ctx.body = err.message;
          } else if (err.expose) {
            ctx.body = err.message;
          } else {
            throw err;
          }

          break;

        case 'json':
          ctx.type = 'application/json';
          if (process.env.NODE_ENV !== 'production') {
            ctx.body = { error: err.message };
          } else if (err.expose) {
            ctx.body = { error: err.message };
          } else {
            ctx.body = { error: http.STATUS_CODES[ctx.status] };
          }

          break;

        case 'html':
          ctx.type = 'text/html';
          if (process.env.NODE_ENV !== 'production') {
            ctx.body = errorHtmlRenderer.render(err);
          } else if (err.expose) {
            ctx.body = err.message;
          } else {
            throw err;
          }

          break;
      }
    }
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})();

module.exports = index;
//# sourceMappingURL=index-node6.cjs.js.map
