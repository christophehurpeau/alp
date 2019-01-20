import Application, { Context } from 'koa';
import parse from 'co-body';

declare module 'koa' {
  interface Request {
    body: any;
  }

  interface BaseContext {
    parseBody(): Promise<void>;
    parseBodyJson(): Promise<void>;
    parseBodyText(): Promise<void>;
  }
}

const assertBodyNotParsed = (ctx: Context) => {
  if (ctx.request.body) {
    throw new Error('Request is already parsed');
  }
};

export default function alpBodyParser(app: Application) {
  app.context.parseBody = async function(this: Context) {
    assertBodyNotParsed(this);
    this.request.body = await parse.form(this);
  };

  app.context.parseBodyJson = async function(this: Context) {
    assertBodyNotParsed(this);
    this.request.body = await parse.json(this);
  };

  app.context.parseBodyText = async function(this: Context) {
    assertBodyNotParsed(this);
    this.request.body = await parse.text(this);
  };
}
