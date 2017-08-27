import AlpModule from './AlpModule';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType, ReducerDictionaryType as _ReducerDictionaryType } from '../types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(() => _ReactNodeType);
const ReactElementType = t.tdz(() => _ReactElementType);
const ReducerDictionaryType = t.tdz(() => _ReducerDictionaryType);
const PropsType = t.type('PropsType', t.exactObject(t.property('reducers', t.nullable(t.ref(ReducerDictionaryType))), t.property('children', t.ref(ReactNodeType))));
let AlpReduxModule = class extends AlpModule {

  render() {
    const _returnType = t.return(t.ref(ReactElementType));

    return _returnType.assert(this.props.children);
  }
};
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleServer.js.map