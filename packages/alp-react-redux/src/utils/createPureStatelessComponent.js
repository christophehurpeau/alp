import { connect } from 'react-redux';

// mergeProps: remove dispatch from dispatchProps (and perf !)
const mergeProps = (stateProps, dispatchProps, ownProps) => ownProps;

export default Component => connect(null, null, mergeProps)(Component);
