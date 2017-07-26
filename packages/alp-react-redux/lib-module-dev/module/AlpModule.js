import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from '../types';

import t from 'flow-runtime';
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(ReactNodeType))));


export default (function alpModule(_arg) {
  var _returnType = t.return(t.ref(ReactElementType));

  var _PropsType$assert = PropsType.assert(_arg),
      children = _PropsType$assert.children;

  return _returnType.assert(children);
});
//# sourceMappingURL=AlpModule.js.map