import { connect } from 'react-redux';

// mergeProps: remove dispatch from dispatchProps (and perf !)
const mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return ownProps;
};

export default (function (Component) {
  return connect(null, null, mergeProps)(Component);
});
//# sourceMappingURL=createPureStatelessComponent.js.map