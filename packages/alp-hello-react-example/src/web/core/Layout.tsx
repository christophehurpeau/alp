import React, { ReactElement } from 'react';
import { Helmet, AppContainer } from 'alp-react';
import App from './App';

export default function Layout(): ReactElement {
  return (
    <AppContainer>
      <Helmet>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {/* <link rel="icon" type="image/png" href={favicon} /> */}
      </Helmet>
      <App />
    </AppContainer>
  );
}
