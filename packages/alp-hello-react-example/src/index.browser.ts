import 'nightingale-app-console';
import Alp from 'alp-browser';
import createReactApp from 'alp-react/browser';
import App from './modules/core/Layout';

const app = new Alp();

app.start(async () => {
  // init
  const browserApp = await app.init();

  // react app
  const renderApp = await createReactApp(browserApp);
  renderApp(App);
});
