import 'nightingale-app-console';
import { startApp } from 'alp-browser';
import createReactApp from 'alp-react/browser';
import App from './web/core/Layout';

startApp((browserApp) => {
  // react app
  const renderApp = createReactApp(browserApp);
  renderApp(App);
});
