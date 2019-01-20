'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var Logger = _interopDefault(require('nightingale-logger'));
var ReactAlpContext = _interopDefault(require('react-alp-context'));

const logger = new Logger('react-alp-subscribe-container');
class SubscribeContainer extends react.Component {
  constructor(...args) {
    super(...args);
    this.subscribed = false;
    this.timeout = undefined;

    this.handleVisibilityChange = () => {
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
    };

    this.subscribe = () => {
      if (document.hidden) return;
      logger.log('subscribe', {
        names: this.props.names,
        name: this.props.name
      });
      this.subscribed = true;
      const names = this.props.names || [this.props.name];
      const websocket = this.getWebsocket();
      names.forEach(name => websocket.emit(`subscribe:${name}`).then(this.props.onEvent));
    };

    this.unsubscribe = () => {
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
    };
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
    return this.context.app.websocket;
  }

  render() {
    return this.props.children;
  }

}
SubscribeContainer.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};
SubscribeContainer.contextType = ReactAlpContext;

exports.default = SubscribeContainer;
//# sourceMappingURL=index-node10.cjs.js.map
