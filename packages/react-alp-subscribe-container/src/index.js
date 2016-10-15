import { PropTypes, Component } from 'react';
import { connect } from 'alp-react-redux';

class SubscribeContainerComponent extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  static contextTypes = {
    context: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, name } = this.props;
    const { context: { app: { websocket } } } = this.context;
    this._handlerConnected = websocket.on('connect', () => {
      websocket.emit(`subscribe:${name}`)
        .then(action => action && dispatch(action));
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
}

export default connect()(SubscribeContainerComponent);
