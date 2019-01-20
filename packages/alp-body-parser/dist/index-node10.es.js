import parse from 'co-body';

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

export default alpBodyParser;
//# sourceMappingURL=index-node10.es.js.map
