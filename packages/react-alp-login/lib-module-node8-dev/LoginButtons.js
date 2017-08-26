import React from 'react';
import List from 'ynnub/components/List';
import LoginButtonGoogle from './LoginButtonGoogle';

export default (function loginButtons() {
  return React.createElement(
    List,
    { links: true },
    React.createElement(
      'li',
      null,
      React.createElement(LoginButtonGoogle, null)
    )
  );
});
//# sourceMappingURL=LoginButtons.js.map