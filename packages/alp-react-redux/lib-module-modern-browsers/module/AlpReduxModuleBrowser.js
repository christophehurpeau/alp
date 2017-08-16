var _class, _temp;

import PropTypes from 'prop-types';
import AlpModule from './AlpModule';
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
    nextProps.reducers !== this.props.reducers && this.setState({
      loading: this.setModuleReducers(nextProps.reducers)
    });
  }

  render() {
    return this.state.loading ? null : this.props.children;
  }
}, _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleBrowser.js.map