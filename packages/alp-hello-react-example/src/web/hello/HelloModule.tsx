import React, { ReactElement } from 'react';
import { AlpModule } from 'alp-react';
import HomePage from './pages/HomePage';

export default function HelloModule(): ReactElement {
  return (
    <AlpModule>
      <HomePage />
    </AlpModule>
  );
}
