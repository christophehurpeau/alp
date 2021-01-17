import { AlpModule } from 'alp-react';
import type { ReactElement } from 'react';
import React from 'react';
import HomePage from './pages/HomePage';

export default function HelloModule(): ReactElement {
  return (
    <AlpModule>
      <HomePage />
    </AlpModule>
  );
}
