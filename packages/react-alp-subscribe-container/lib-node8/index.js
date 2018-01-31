'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _class, _temp2;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _alpReactRedux = require('alp-react-redux');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('react-alp-subscribe-container');

let SubscribeContainerComponent = (_temp2 = _class = class extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {}, this.subscribed = false, this.timeout = null, this.handleVisibilityChange = () => {
      if (!document.hidden) {
        if (this.timeout) {
          logger.log('timeout cleared', { names: this.props.names, name: this.props.name });
          clearTimeout(this.timeout);
        } else {
          logger.debug('resubscribe', { names: this.props.names, name: this.props.name });
          this.subscribe();
        }
        return;
      }

      if (!this.subscribed) return;

      logger.log('timeout visible', { names: this.props.names, name: this.props.name });
      this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
    }, this.subscribe = () => {
      if (document.hidden) return;

      logger.log('subscribe', { names: this.props.names, name: this.props.name });
      this.subscribed = true;
      const { dispatch } = this.props;
      const names = this.props.names || [this.props.name];
      const websocket = this.getWebsocket();
      names.forEach(name => websocket.emit(`subscribe:${name}`).then(action => action && dispatch(action)));
    }, this.unsubscribe = () => {
      this.timeout = null;
      if (!this.subscribed) return;
      logger.log('unsubscribe', { names: this.props.names, name: this.props.name });
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
}, _class.propTypes = {
  dispatch: _propTypes2.default.func.isRequired,
  name: _propTypes2.default.string,
  names: _propTypes2.default.arrayOf(_propTypes2.default.string.isRequired),
  children: _propTypes2.default.node,
  visibleTimeout: _propTypes2.default.number
}, _class.defaultProps = {
  visibleTimeout: 120000 // 2 minutes
}, _class.contextTypes = {
  context: _propTypes2.default.object
}, _temp2);
exports.default = (0, _alpReactRedux.connect)()(SubscribeContainerComponent);
//# sourceMappingURL=index.js.map