import React, { ReactComponentElement } from 'react';
import LoginButtonGoogle from './LoginButtonGoogle';

export default (): ReactComponentElement<'ul'> => (
  <ul>
    <li>
      <LoginButtonGoogle />
    </li>
  </ul>
);
