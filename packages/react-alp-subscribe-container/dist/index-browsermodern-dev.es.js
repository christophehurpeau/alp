import { Component } from 'react';
import PropTypes from 'prop-types';
import Logger from 'nightingale-logger';
import { connect } from 'react-redux';

const logger = new Logger('react-alp-subscribe-container');
class SubscribeContainer extends Component {
  constructor(...args) {
    var _temp, _this;

    return _temp = _this = super(...args), this.subscribed = false, this.timeout = undefined, this.handleVisibilityChange = function () {
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
    }, this.subscribe = function () {
      if (document.hidden) return;
      logger.log('subscribe', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.subscribed = true;
      const {
        dispatch
      } = _this.props;
      const names = _this.props.names || [_this.props.name];

      const websocket = _this.getWebsocket();

      names.forEach(function (name) {
        return websocket.emit(`subscribe:${name}`).then(function (action) {
          return action && dispatch(action);
        });
      });
    }, this.unsubscribe = function () {
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
//# sourceMappingURL=index-browsermodern-dev.es.js.map
