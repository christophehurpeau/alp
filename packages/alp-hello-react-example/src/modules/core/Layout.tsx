import React from 'react';
import { Helmet, AppContainer } from 'alp-react';
import ynnubHelmet from 'ynnub/Head';
import './LayoutCss';
import App from './App';

export default () => (
  <AppContainer>
    <Helmet>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />$
      {ynnubHelmet()}
      {/* <link rel="icon" type="image/png" href={favicon} /> */}
    </Helmet>
    <App />
  </AppContainer>
);
