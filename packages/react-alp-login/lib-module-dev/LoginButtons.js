import React from 'react';
import { Element as _Element } from 'react';
import LoginButtonGoogle from './LoginButtonGoogle';

import t from 'flow-runtime';
var Element = t.tdz(function () {
  return _Element;
});
export default (function loginButtons() {
  var _returnType = t.return(t.ref(Element, t.string('ul')));

  return _returnType.assert(React.createElement(
    'ul',
    null,
    React.createElement(
      'li',
      null,
      React.createElement(LoginButtonGoogle, null)
    )
  ));
});
//# sourceMappingURL=LoginButtons.js.map