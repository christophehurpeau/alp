import React from 'react';
import { Element as _Element, Node as _Node } from 'react';

import t from 'flow-runtime';
var Element = t.tdz(function () {
  return _Element;
});
var Node = t.tdz(function () {
  return _Node;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node))));


export default (function appContainer(_arg) {
  var _returnType = t.return(t.ref(Element, t.string('div')));

  var _PropsType$assert = PropsType.assert(_arg),
      children = _PropsType$assert.children;

  return _returnType.assert(React.createElement(
    'div',
    null,
    children
  ));
});
//# sourceMappingURL=AppContainer.js.map