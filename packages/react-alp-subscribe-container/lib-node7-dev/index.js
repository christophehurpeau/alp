'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dec, _desc, _value, _class, _descriptor, _class2, _temp2;

var _react = require('react');

var _alpReactRedux = require('alp-react-redux');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

const logger = new _nightingaleLogger2.default('react-alp-subscribe-container');

let SubscribeContainerComponent = (_dec = _flowRuntime2.default.decorate(_flowRuntime2.default.boolean()), (_class = (_temp2 = _class2 = class extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), _initDefineProp(this, 'subscribed', _descriptor, this), this.timeout = null, this.state = {}, this.handleVisibilityChange = () => {
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
    }, this.subscribe = () => {
      if (document.hidden) return;

      logger.log('subscribe', { name: this.props.name });
      this.subscribed = true;
      const { dispatch, name } = this.props;
      const websocket = this.getWebsocket();
      websocket.emit(`subscribe:${name}`).then(action => action && dispatch(action));
    }, this.unsubscribe = () => {
      this.timeout = null;
      if (!this.subscribed) return;
      logger.log('unsubscribe', { name: this.props.name });
      this.subscribed = false;
      const { name } = this.props;
      const websocket = this.getWebsocket();
      if (websocket.isConnected()) {
        websocket.emit(`unsubscribe:${name}`);
      }
    }, _temp;
  }

  getWebsocket() {
    return this.context.context.app.websocket;
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

  render() {
    return this.props.children;
  }
}, _class2.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  name: _react.PropTypes.string.isRequired,
  children: _react.PropTypes.node,
  visibleTimeout: _react.PropTypes.number
}, _class2.defaultProps = {
  visibleTimeout: 120000 }, _class2.contextTypes = {
  context: _react.PropTypes.object
}, _temp2), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'subscribed', [_dec], {
  enumerable: true,
  initializer: function () {
    return false;
  }
})), _class));
exports.default = (0, _alpReactRedux.connect)()(SubscribeContainerComponent);
//# sourceMappingURL=index.js.map