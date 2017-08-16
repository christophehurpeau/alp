var _class, _temp;

import PropTypes from 'prop-types';
import AlpModule from './AlpModule';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from '../types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
const ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
const PropsType = t.type('PropsType', t.exactObject(t.property('reducers', t.object(t.indexer('key', t.string(), t.any()))), t.property('children', t.ref(ReactNodeType))));
let AlpReduxModule = (_temp = _class = class extends AlpModule {

  constructor(props, context) {
    super(props, context), this.state = {
      loading: this.setModuleReducers(props.reducers)
    };
  }

  setModuleReducers(reducers) {
    var _this = this;

    if (!this.context.setModuleReducers) return false; // pre render
    const result = this.context.setModuleReducers(reducers);
    return result !== false && (result.then(function () {
      _this.setState({ loading: false });
    }), true);
  }

  componentWillReceiveProps(nextProps) {
    let _nextPropsType = t.ref(PropTypes);

    t.param('nextProps', _nextPropsType).assert(nextProps), nextProps.reducers !== this.props.reducers && this.setState({
      loading: this.setModuleReducers(nextProps.reducers)
    });
  }

  render() {
    const _returnType = t.return(t.union(t.ref(ReactElementType), t.null()));

    return _returnType.assert(this.state.loading ? null : this.props.children);
  }
}, _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleBrowser.js.map