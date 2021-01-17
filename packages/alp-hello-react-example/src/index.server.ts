import 'nightingale-app-console';
import Alp from 'alp-node';
import createReactApp from 'alp-react';
import App from './web/core/Layout';

const app = new Alp();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.start(() => {
  // init
  // call here any init app

  // react app
  const appCallback = createReactApp(App);

  // middlewares
  app.servePublic();
  app.catchErrors();
  app.use(appCallback);
});
