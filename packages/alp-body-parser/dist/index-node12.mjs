import parse from 'co-body';

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

export default alpBodyParser;
//# sourceMappingURL=index-node12.mjs.map
