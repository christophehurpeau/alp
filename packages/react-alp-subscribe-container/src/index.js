import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'alp-react-redux';
import Logger from 'nightingale-logger';

const logger = new Logger('react-alp-subscribe-container');

class SubscribeContainerComponent extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    visibleTimeout: PropTypes.number,
  };

  static defaultProps = {
    visibleTimeout: 1000 * 60 * 2, // 2 minutes
  };

  static contextTypes = {
    context: PropTypes.object,
  };


  subscribed: boolean = false;
  timeout = null;
  state = {};

  getWebsocket() {
    return this.context.context.app.websocket;
  }


  handleVisibilityChange = () => {
    if (!document.hidden) {
      if (this.timeout) {
        logger.log('timeout cleared', { name: this.props.name });
        clearTimeout(this.timeout);
      } else {
        logger.debug('resubscribe', { name: this.props.name });
        this.subscribe();
      }
      return;
    }

    if (!this.subscribed) return;

    logger.log('timeout visible', { name: this.props.name });
    this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
  };

  subscribe = () => {
    if (document.hidden) return;

    logger.log('subscribe', { name: this.props.name });
    this.subscribed = true;
    const { dispatch, name } = this.props;
    const websocket = this.getWebsocket();
    websocket.emit(`subscribe:${name}`)
            .then(action => action && dispatch(action));
  };

  unsubscribe = () => {
    this.timeout = null;
    if (!this.subscribed) return;
    logger.log('unsubscribe', { name: this.props.name });
    this.subscribed = false;
    const { name } = this.props;
    const websocket = this.getWebsocket();
    if (websocket.isConnected()) {
      websocket.emit(`unsubscribe:${name}`);
    }
  };

  componentDidMount() {
    const websocket = this.getWebsocket();
    websocket.on('connect', this.subscribe);
    if (websocket.isConnected()) {
      this.subscribe();
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange, false);
    this.getWebsocket().off('connect', this.subscribe);
    this.unsubscribe();
  }

  render() {
    return this.props.children;
  }
}

export default connect()(SubscribeContainerComponent);
