import parse from "co-body";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import Application, { Context } from "koa";

declare module "koa" {
  interface Request {
    body: any;
  }

  interface BaseContext {
    parseBody: <T>() => Promise<T>;
    parseBodyJson: <T>() => Promise<T>;
    parseBodyText: <T>() => Promise<T>;
  }
}

const assertBodyNotParsed = (ctx: Context): void => {
  if (ctx.request.body) {
    throw new Error("Request is already parsed");
  }
};

export default function alpBodyParser(app: Application): void {
  app.context.parseBody = async function parseBody<T>(
    this: Context,
  ): Promise<T> {
    assertBodyNotParsed(this);
    const body: T = (await parse.form(this)) as T;
    this.request.body = body;
    return body;
  };

  app.context.parseBodyJson = async function parseBodyJson<T>(
    this: Context,
  ): Promise<T> {
    assertBodyNotParsed(this);
    const body: T = (await parse.json(this)) as T;
    this.request.body = body;
    return body;
  };

  app.context.parseBodyText = async function parseBodyText<T>(
    this: Context,
  ): Promise<T> {
    assertBodyNotParsed(this);
    const body: T = (await parse.text(this)) as T;
    this.request.body = body;
    return body;
  };
}
