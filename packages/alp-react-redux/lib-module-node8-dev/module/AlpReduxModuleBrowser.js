var _class, _temp;

import { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from '../types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(() => _ReactNodeType);
const ReactElementType = t.tdz(() => _ReactElementType);
const PropsType = t.type('PropsType', t.exactObject(t.property('reducers', t.object(t.indexer('key', t.string(), t.any()))), t.property('children', t.ref(ReactNodeType))));
let AlpReduxModule = (_temp = _class = class extends Component {

  constructor(props, context) {
    super(props, context);
    this.context.setModuleReducers(props.reducers);
  }

  componentWillReceiveProps(nextProps) {
    let _nextPropsType = t.ref(PropTypes);

    t.param('nextProps', _nextPropsType).assert(nextProps);

    if (nextProps.reducers !== this.props.reducers) {
      this.context.setModuleReducers(nextProps.reducers);
    }
  }

  render() {
    const _returnType = t.return(t.ref(ReactElementType));

    return _returnType.assert(this.props.children);
  }
}, _class.propTypes = t.propTypes(PropsType), _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleBrowser.js.map