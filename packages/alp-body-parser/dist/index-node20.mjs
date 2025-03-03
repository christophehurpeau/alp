import parse from 'co-body';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports

const assertBodyNotParsed = ctx => {
  if (ctx.request.body) {
    throw new Error("Request is already parsed");
  }
};
function alpBodyParser(app) {
  app.context.parseBody = async function parseBody() {
    assertBodyNotParsed(this);
    const body = await parse.form(this);
    this.request.body = body;
    return body;
  };
  app.context.parseBodyJson = async function parseBodyJson() {
    assertBodyNotParsed(this);
    const body = await parse.json(this);
    this.request.body = body;
    return body;
  };
  app.context.parseBodyText = async function parseBodyText() {
    assertBodyNotParsed(this);
    const body = await parse.text(this);
    this.request.body = body;
    return body;
  };
}

export { alpBodyParser as default };
//# sourceMappingURL=index-node20.mjs.map
