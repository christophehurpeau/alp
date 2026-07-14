import { STATUS_CODES } from "node:http";
// eslint-disable-next-line import-x/no-unresolved
import { createErrorHtmlRenderer } from "error-html";
// eslint-disable-next-line import-x/no-unresolved
import { Logger } from "nightingale-logger";
import type { Context } from "./AlpNodeApp";
import type { HtmlError } from "./types";

const logger = new Logger("alp:errors");
const errorHtmlRenderer = createErrorHtmlRenderer({
  appPath: `${process.cwd()}/`,
});

const castToError = (error: unknown): Error => {
  if (!error) return new Error("Unknown error");
  if (typeof error === "string") return new Error(error);
  if (error instanceof Error) return error;
  return new Error("Unknown error");
};

export default async function alpNodeErrors(
  ctx: Context,
  next: () => Promise<void> | void,
): Promise<void> {
  try {
    await next();
  } catch (unknownError: unknown) {
    const error = castToError(unknownError);

    ctx.status = (error as HtmlError).status || 500;

    logger.error(error);

    switch (ctx.request.accepts("html", "text", "json")) {
      case "json":
        ctx.type = "application/json";
        if (
          process.env.NODE_ENV !== "production" ||
          (error as HtmlError).expose
        ) {
          ctx.body = { error: error.message };
        } else {
          ctx.body = { error: STATUS_CODES[ctx.status] };
        }

        break;

      case "html":
        ctx.type = "text/html";
        if (process.env.NODE_ENV !== "production") {
          ctx.body = errorHtmlRenderer.render(error);
        } else if ((error as HtmlError).expose) {
          ctx.body = error.message;
        } else {
          throw error;
        }

        break;

      case "text":
      case false:
      default:
        ctx.type = "text/plain";
        if (
          process.env.NODE_ENV !== "production" ||
          (error as HtmlError).expose
        ) {
          ctx.body = error.message;
        } else {
          throw error;
        }

        break;
    }
  }
}
