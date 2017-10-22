import React from 'react';
import { Element as _Element, Node as _Node } from 'react';

import t from 'flow-runtime';
const Element = t.tdz(() => _Element);
const Node = t.tdz(() => _Node);
const PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node))));


export default (function appContainer(_arg) {
  const _returnType = t.return(t.ref(Element, t.string('div')));

  let { children } = PropsType.assert(_arg);
  return _returnType.assert(React.createElement(
    'div',
    null,
    children
  ));
});
//# sourceMappingURL=AppContainer.js.map