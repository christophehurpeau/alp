'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const parse = require('co-body');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const parse__default = /*#__PURE__*/_interopDefaultLegacy(parse);

const assertBodyNotParsed = ctx => {
  if (ctx.request.body) {
    throw new Error('Request is already parsed');
  }
};

function alpBodyParser(app) {
  app.context.parseBody = async function () {
    assertBodyNotParsed(this);
    const body = await parse__default.form(this);
    this.request.body = body;
    return body;
  };

  app.context.parseBodyJson = async function () {
    assertBodyNotParsed(this);
    const body = await parse__default.json(this);
    this.request.body = body;
    return body;
  };

  app.context.parseBodyText = async function () {
    assertBodyNotParsed(this);
    const body = await parse__default.text(this);
    this.request.body = body;
    return body;
  };
}

exports.default = alpBodyParser;
//# sourceMappingURL=index-node12.cjs.js.map
