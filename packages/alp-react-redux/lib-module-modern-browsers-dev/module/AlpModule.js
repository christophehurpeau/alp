var _class, _temp;

import { Component } from 'react';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from '../types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
const ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
const PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(ReactNodeType))));
let AlpModule = (_temp = _class = class extends Component {

  render() {
    const _returnType = t.return(t.ref(ReactElementType));

    if (this.props.reducers) throw new Error('You have reducers, probably want to use AlpReduxModule.');

    return _returnType.assert(this.props.children);
  }
}, _class.propTypes = t.propTypes(PropsType), _temp);
export { AlpModule as default };
//# sourceMappingURL=AlpModule.js.map