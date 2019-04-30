import React from 'react';
import { AlpModule } from 'alp-react';
import HomePage from './pages/HomePage';

export default function HelloModule() {
  return (
    <AlpModule>
      <HomePage />
    </AlpModule>
  );
}
