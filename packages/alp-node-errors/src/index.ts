import { STATUS_CODES } from 'http';
import type { Context, HtmlError } from 'alp-types';
import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: `${process.cwd()}/`,
});

export default async function alpNodeErrors(
  ctx: Context,
  next: () => void | Promise<void>,
): Promise<void> {
  try {
    await next();
  } catch (err: unknown) {
    // eslint-disable-next-line no-ex-assign
    if (!err) err = new Error('Unknown error');
    // eslint-disable-next-line no-ex-assign
    if (typeof err === 'string') err = new Error(err);

    ctx.status = (err as HtmlError).status || 500;
    logger.error(err as any);

    switch (ctx.accepts('html', 'text', 'json')) {
      case 'text':
        ctx.type = 'text/plain';
        if (
          process.env.NODE_ENV !== 'production' ||
          (err as HtmlError).expose
        ) {
          ctx.body = (err as Error).message;
        } else {
          throw err;
        }

        break;

      case 'json':
        ctx.type = 'application/json';
        if (
          process.env.NODE_ENV !== 'production' ||
          (err as HtmlError).expose
        ) {
          ctx.body = { error: (err as Error).message };
        } else {
          ctx.body = { error: STATUS_CODES[ctx.status] };
        }

        break;

      case 'html':
        ctx.type = 'text/html';
        if (process.env.NODE_ENV !== 'production') {
          ctx.body = errorHtmlRenderer.render(err as Error);
        } else if ((err as HtmlError).expose) {
          ctx.body = (err as Error).message;
        } else {
          throw err;
        }

        break;
    }
  }
}
