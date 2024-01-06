/* eslint-disable complexity */
import { STATUS_CODES } from 'node:http';
import ErrorHtmlRenderer from 'error-html';
import { Logger } from 'nightingale-logger';
import type { Context } from './AlpNodeApp';
import type { HtmlError } from './types';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: `${process.cwd()}/`,
});

export default async function alpNodeErrors(
  ctx: Context,
  next: () => Promise<void> | void,
): Promise<void> {
  try {
    await next();
  } catch (error: unknown) {
    // eslint-disable-next-line no-ex-assign
    if (!error) error = new Error('Unknown error');
    // eslint-disable-next-line no-ex-assign
    if (typeof error === 'string') error = new Error(error);

    ctx.status = (error as HtmlError).status || 500;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    logger.error(error as any);

    switch (ctx.request.accepts('html', 'text', 'json')) {
      case 'json':
        ctx.type = 'application/json';
        if (
          process.env.NODE_ENV !== 'production' ||
          (error as HtmlError).expose
        ) {
          ctx.body = { error: (error as Error).message };
        } else {
          ctx.body = { error: STATUS_CODES[ctx.status] };
        }

        break;

      case 'html':
        ctx.type = 'text/html';
        if (process.env.NODE_ENV !== 'production') {
          ctx.body = errorHtmlRenderer.render(error as Error);
        } else if ((error as HtmlError).expose) {
          ctx.body = (error as Error).message;
        } else {
          throw error;
        }

        break;

      case 'text':
      default:
        ctx.type = 'text/plain';
        if (
          process.env.NODE_ENV !== 'production' ||
          (error as HtmlError).expose
        ) {
          ctx.body = (error as Error).message;
        } else {
          throw error;
        }

        break;
    }
  }
}
