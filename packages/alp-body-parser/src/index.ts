import parse from 'co-body';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import Application, { Context } from 'koa';

declare module 'koa' {
  interface Request {
    body: any;
  }

  interface BaseContext {
    parseBody: () => Promise<void>;
    parseBodyJson: () => Promise<void>;
    parseBodyText: () => Promise<void>;
  }
}

const assertBodyNotParsed = (ctx: Context): void => {
  if (ctx.request.body) {
    throw new Error('Request is already parsed');
  }
};

export default function alpBodyParser(app: Application): void {
  app.context.parseBody = async function (this: Context): Promise<void> {
    assertBodyNotParsed(this);
    const body: unknown = await parse.form(this);
    this.request.body = body;
  };

  app.context.parseBodyJson = async function (this: Context): Promise<void> {
    assertBodyNotParsed(this);
    const body: unknown = await parse.json(this);
    this.request.body = body;
  };

  app.context.parseBodyText = async function <T extends string>(
    this: Context,
  ): Promise<void> {
    assertBodyNotParsed(this);
    const body: unknown = await parse.text(this);
    this.request.body = body;
  };
}
