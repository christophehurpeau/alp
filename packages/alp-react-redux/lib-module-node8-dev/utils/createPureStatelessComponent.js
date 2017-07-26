import { connect } from 'react-redux';

// mergeProps: remove dispatch from dispatchProps (and perf !)
const mergeProps = (stateProps, dispatchProps, ownProps) => ownProps;

export default (function createPureStatelessComponent(Component) {
  return connect(null, null, mergeProps)(Component);
});
//# sourceMappingURL=createPureStatelessComponent.js.map