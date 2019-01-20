import { Component } from 'react';
import Logger from 'nightingale-logger';
import ReactAlpContext from 'react-alp-context';

const logger = new Logger('react-alp-subscribe-container');
class SubscribeContainer extends Component {
  constructor(...args) {
    var _this;

    super(...args);
    _this = this;
    this.subscribed = false;
    this.timeout = undefined;

    this.handleVisibilityChange = function () {
      if (!document.hidden) {
        if (_this.timeout != null) {
          logger.log('timeout cleared', {
            names: _this.props.names,
            name: _this.props.name
          });
          clearTimeout(_this.timeout);
        } else {
          logger.debug('resubscribe', {
            names: _this.props.names,
            name: _this.props.name
          });

          _this.subscribe();
        }

        return;
      }

      if (!_this.subscribed) return;
      logger.log('timeout visible', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.timeout = setTimeout(_this.unsubscribe, _this.props.visibleTimeout);
    };

    this.subscribe = function () {
      if (document.hidden) return;
      logger.log('subscribe', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.subscribed = true;
      const names = _this.props.names || [_this.props.name];

      const websocket = _this.getWebsocket();

      names.forEach(function (name) {
        return websocket.emit(`subscribe:${name}`).then(_this.props.onEvent);
      });
    };

    this.unsubscribe = function () {
      _this.timeout = undefined;
      if (!_this.subscribed) return;
      logger.log('unsubscribe', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.subscribed = false;
      const names = _this.props.names || [_this.props.name];

      const websocket = _this.getWebsocket();

      if (websocket.isConnected()) {
        names.forEach(function (name) {
          return websocket.emit(`unsubscribe:${name}`);
        });
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

export default SubscribeContainer;
//# sourceMappingURL=index-browsermodern.es.js.map
