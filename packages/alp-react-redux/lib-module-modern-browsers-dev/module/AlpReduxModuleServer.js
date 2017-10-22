import { Node as _Node } from 'react';
import AlpModule from './AlpModule';
import { ReducerDictionaryType as _ReducerDictionaryType } from '../types';

import t from 'flow-runtime';
const ReducerDictionaryType = t.tdz(function () {
  return _ReducerDictionaryType;
});
const Node = t.tdz(function () {
  return _Node;
});
const PropsType = t.type('PropsType', t.exactObject(t.property('reducers', t.nullable(t.ref(ReducerDictionaryType))), t.property('children', t.ref(Node))));
let AlpReduxModule = class extends AlpModule {

  render() {
    const _returnType = t.return(t.ref(Node));

    return _returnType.assert(this.props.children);
  }
};
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleServer.js.map