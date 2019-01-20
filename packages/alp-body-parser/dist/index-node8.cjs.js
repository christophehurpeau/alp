'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var parse = _interopDefault(require('co-body'));

const assertBodyNotParsed = ctx => {
  if (ctx.request.body) {
    throw new Error('Request is already parsed');
  }
};

function alpBodyParser(app) {
  app.context.parseBody = async function () {
    assertBodyNotParsed(this);
    this.request.body = await parse.form(this);
  };

  app.context.parseBodyJson = async function () {
    assertBodyNotParsed(this);
    this.request.body = await parse.json(this);
  };

  app.context.parseBodyText = async function () {
    assertBodyNotParsed(this);
    this.request.body = await parse.text(this);
  };
}

exports.default = alpBodyParser;
//# sourceMappingURL=index-node8.cjs.js.map
