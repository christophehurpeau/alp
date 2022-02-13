import { AlpModule } from 'alp-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ObjectAssign from 'object-assign';
import type { ReactElement } from 'react';
import HomePage from './pages/HomePage';

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
(async function test() {
  console.log(
    await new Promise((resolve) => {
      resolve('ok');
    }),
  );

  console.log(ObjectAssign({}, { a: true }));
})();

export default function HelloModule(): ReactElement {
  return (
    <AlpModule>
      <HomePage />
    </AlpModule>
  );
}
