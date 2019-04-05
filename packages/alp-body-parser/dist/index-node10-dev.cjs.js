'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const parse = _interopDefault(require('co-body'));

const assertBodyNotParsed = ctx => {
  if (ctx.request.body) {
    throw new Error('Request is already parsed');
  }
};

function alpBodyParser(app) {
  app.context.parseBody = async function () {
    assertBodyNotParsed(this);
    const body = await parse.form(this);
    this.request.body = body;
    return body;
  };

  app.context.parseBodyJson = async function () {
    assertBodyNotParsed(this);
    const body = await parse.json(this);
    this.request.body = body;
    return body;
  };

  app.context.parseBodyText = async function () {
    assertBodyNotParsed(this);
    const body = await parse.text(this);
    this.request.body = body;
    return body;
  };
}

exports.default = alpBodyParser;
//# sourceMappingURL=index-node10-dev.cjs.js.map
