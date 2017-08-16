'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpBodyParser;

var _coBody = require('co-body');

var _coBody2 = _interopRequireDefault(_coBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseBody(type, ctx) {
  if (ctx.request.body) throw new Error('Request is already parsed');

  return _coBody2.default[type](ctx).then(body => (ctx.request.body = body, body));
}

/**
 * @param {Koa} app
 */
function alpBodyParser(app) {
  app.context.parseBody = function () {
    return parseBody('form', this);
  }, app.context.parseBodyJson = function () {
    return parseBody('json', this);
  }, app.context.parseBodyText = function () {
    return parseBody('text', this);
  };
}
//# sourceMappingURL=index.js.map