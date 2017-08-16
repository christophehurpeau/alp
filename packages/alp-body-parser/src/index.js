import parse from 'co-body';

function parseBody(type, ctx) {
  if (ctx.request.body) {
    throw new Error('Request is already parsed');
  }

  return parse[type](ctx).then(body => {
    ctx.request.body = body;
    return body;
  });
}

/**
 * @param {Koa} app
 */
export default function alpBodyParser(app) {
  app.context.parseBody = function() {
    return parseBody('form', this);
  };

  app.context.parseBodyJson = function() {
    return parseBody('json', this);
  };

  app.context.parseBodyText = function() {
    return parseBody('text', this);
  };
}
