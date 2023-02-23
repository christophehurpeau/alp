import Alp from 'alp-node';
import { appLogger, addConfig } from 'nightingale-app-console';
import webProcessor from 'nightingale-web-processor';

declare module 'alp-types' {
  interface Context {
    logger: typeof appLogger;
  }
}

const app = new Alp();

addConfig(
  {
    processors: [webProcessor],
  },
  true,
);
await app.start(() => {
  app.use((ctx, next) => {
    ctx.logger = appLogger.context({ request: ctx.req });
    return next();
  });
  app.use((ctx, next) => {
    ctx.logger.info('Request');
    return next();
  });
  app.catchErrors();
  app.use((ctx) => {
    ctx.body = { ok: true };
  });
});
