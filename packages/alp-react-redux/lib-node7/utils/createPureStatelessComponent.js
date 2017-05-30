'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

// mergeProps: remove dispatch from dispatchProps (and perf !)
const mergeProps = (stateProps, dispatchProps, ownProps) => ownProps;

exports.default = Component => (0, _reactRedux.connect)(null, null, mergeProps)(Component);
//# sourceMappingURL=createPureStatelessComponent.js.map