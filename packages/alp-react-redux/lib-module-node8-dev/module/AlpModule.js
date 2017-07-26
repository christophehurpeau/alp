import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from '../types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(() => _ReactNodeType);
const ReactElementType = t.tdz(() => _ReactElementType);
const PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(ReactNodeType))));


export default (function alpModule(_arg) {
  const _returnType = t.return(t.ref(ReactElementType));

  let { children } = PropsType.assert(_arg);
  return _returnType.assert(children);
});
//# sourceMappingURL=AlpModule.js.map