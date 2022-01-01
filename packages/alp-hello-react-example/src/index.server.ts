import Alp from 'alp-node';
import createReactApp from 'alp-react';
import { addConfig, appLogger } from 'nightingale-app-console';
import type { Logger } from 'nightingale-logger';
import webProcessor from 'nightingale-web-processor';
import App from './web/core/Layout';
import './server/hello';

declare module 'alp-types' {
  interface Context {
    logger: Logger;
  }
}

const app = new Alp();

addConfig(
  {
    processors: [webProcessor],
  },
  true,
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.start(() => {
  // init
  // call here any init app

  // react app
  const appCallback = createReactApp(App);

  // middlewares
  app.servePublic();
  app.use((ctx, next) => {
    ctx.logger = appLogger.context({ request: ctx.req });
    return next();
  });
  app.use((ctx, next) => {
    ctx.logger.info('Request');
    return next();
  });
  app.catchErrors();
  app.use(appCallback);
});
