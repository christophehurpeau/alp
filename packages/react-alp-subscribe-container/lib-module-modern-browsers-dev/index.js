var _class, _temp;

import { PropTypes, Component } from 'react';
import { connect } from 'alp-react-redux';

let SubscribeContainerComponent = (_temp = _class = class extends Component {

  componentDidMount() {
    const { dispatch, name } = this.props;
    const { context: { app: { websocket } } } = this.context;
    this._handlerConnected = websocket.on('connect', function () {
      websocket.emit(`subscribe:${name}`).then(function (action) {
        return action && dispatch(action);
      });
    });
    if (websocket.isConnected()) {
      this._handlerConnected();
    }
  }

  componentWillUnmount() {
    const { name } = this.props;
    const { context } = this.context;
    const websocket = context.app.websocket;
    if (websocket.isConnected()) {
      websocket.emit(`unsubscribe:${name}`);
    }

    websocket.off('connect', this._handlerConnected);
  }

  render() {
    return this.props.children;
  }
}, _class.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node
}, _class.contextTypes = {
  context: PropTypes.object
}, _temp);


export default connect()(SubscribeContainerComponent);
//# sourceMappingURL=index.js.map