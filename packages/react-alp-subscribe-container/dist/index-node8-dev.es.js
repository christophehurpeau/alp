import { Component } from 'react';
import PropTypes from 'prop-types';
import Logger from 'nightingale-logger';
import { connect } from 'react-redux';

const logger = new Logger('react-alp-subscribe-container');
class SubscribeContainer extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.subscribed = false, this.timeout = undefined, this.handleVisibilityChange = () => {
      if (!document.hidden) {
        if (this.timeout != null) {
          logger.log('timeout cleared', {
            names: this.props.names,
            name: this.props.name
          });
          clearTimeout(this.timeout);
        } else {
          logger.debug('resubscribe', {
            names: this.props.names,
            name: this.props.name
          });
          this.subscribe();
        }

        return;
      }

      if (!this.subscribed) return;
      logger.log('timeout visible', {
        names: this.props.names,
        name: this.props.name
      });
      this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
    }, this.subscribe = () => {
      if (document.hidden) return;
      logger.log('subscribe', {
        names: this.props.names,
        name: this.props.name
      });
      this.subscribed = true;
      const {
        dispatch
      } = this.props;
      const names = this.props.names || [this.props.name];
      const websocket = this.getWebsocket();
      names.forEach(name => websocket.emit(`subscribe:${name}`).then(action => action && dispatch(action)));
    }, this.unsubscribe = () => {
      this.timeout = undefined;
      if (!this.subscribed) return;
      logger.log('unsubscribe', {
        names: this.props.names,
        name: this.props.name
      });
      this.subscribed = false;
      const names = this.props.names || [this.props.name];
      const websocket = this.getWebsocket();

      if (websocket.isConnected()) {
        names.forEach(name => websocket.emit(`unsubscribe:${name}`));
      }
    }, _temp;
  }

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

  getWebsocket() {
    return this.context.context.app.websocket;
  }

  render() {
    return this.props.children;
  }

}
SubscribeContainer.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};
SubscribeContainer.contextTypes = {
  context: PropTypes.object
};

const SubscribeContainerConnected = connect()(SubscribeContainer);

export default SubscribeContainerConnected;
//# sourceMappingURL=index-node8-dev.es.js.map
