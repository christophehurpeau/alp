var _class, _temp;

import { Component } from 'react';
import PropTypes from 'prop-types';
let AlpReduxModule = (_temp = _class = class extends Component {

  constructor(props, context) {
    super(props, context);
    this.context.setModuleReducers(props.reducers);
  }

  render() {
    return this.props.children;
  }
}, _class.contextTypes = {
  setModuleReducers: PropTypes.func.isRequired
}, _temp);
export { AlpReduxModule as default };
//# sourceMappingURL=AlpReduxModuleServer.js.map