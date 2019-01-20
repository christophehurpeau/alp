import 'nightingale-app-console';
import Alp from 'alp-node';
import createReactApp from 'alp-react';
import App from './modules/core/Layout';

const app = new Alp();

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
