var _class, _temp;

import { Component, Node as _Node } from 'react';

import t from 'flow-runtime';
const Node = t.tdz(function () {
  return _Node;
});
const PropsType = t.type('PropsType', t.exactObject(t.property('children', t.ref(Node))));
let AlpModule = (_temp = _class = class extends Component {

  render() {
    const _returnType = t.return(t.ref(Node));

    if (this.props.reducers) {
      throw new Error('You have reducers, probably want to use AlpReduxModule.');
    }

    return _returnType.assert(this.props.children);
  }
}, _class.propTypes = t.propTypes(PropsType), _temp);
export { AlpModule as default };
//# sourceMappingURL=AlpModule.js.map