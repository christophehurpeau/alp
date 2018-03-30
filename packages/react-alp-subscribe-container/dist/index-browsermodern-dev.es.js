import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ReduxDispatchType } from 'alp-react-redux';
import Logger from 'nightingale-logger';
import t from 'flow-runtime';

var _dec, _class, _descriptor, _class2, _temp;

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
const ReduxDispatchType$1 = t.tdz(function () {
  return ReduxDispatchType;
});
const logger = new Logger('react-alp-subscribe-container');

const Props = t.type('Props', t.exactObject(t.property('children', t.ref('Node')), t.property('dispatch', t.ref(ReduxDispatchType$1)), t.property('name', t.nullable(t.string()), true), t.property('names', t.nullable(t.array(t.string())), true), t.property('visibleTimeout', t.nullable(t.number()), true)));
let SubscribeContainerComponent = (_dec = t.decorate(t.boolean()), _class = (_temp = _class2 = class extends Component {

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

  constructor(...args) {
    var _this = super(...args);

    _initDefineProp(this, 'subscribed', _descriptor, this);

    this.timeout = null;

    this.handleVisibilityChange = function () {
      if (!document.hidden) {
        if (_this.timeout) {
          logger.log('timeout cleared', { names: _this.props.names, name: _this.props.name });
          clearTimeout(_this.timeout);
        } else {
          logger.debug('resubscribe', { names: _this.props.names, name: _this.props.name });
          _this.subscribe();
        }
        return;
      }

      if (!_this.subscribed) return;

      logger.log('timeout visible', { names: _this.props.names, name: _this.props.name });
      _this.timeout = setTimeout(_this.unsubscribe, _this.props.visibleTimeout);
    };

    this.subscribe = function () {
      if (document.hidden) return;

      logger.log('subscribe', { names: _this.props.names, name: _this.props.name });
      _this.subscribed = true;
      const { dispatch } = _this.props;
      const names = _this.props.names || [_this.props.name];
      const websocket = _this.getWebsocket();
      names.forEach(function (name) {
        return websocket.emit(`subscribe:${name}`).then(function (action) {
          return action && dispatch(action);
        });
      });
    };

    this.unsubscribe = function () {
      _this.timeout = null;
      if (!_this.subscribed) return;
      logger.log('unsubscribe', { names: _this.props.names, name: _this.props.name });
      _this.subscribed = false;
      const names = _this.props.names || [_this.props.name];
      const websocket = _this.getWebsocket();
      if (websocket.isConnected()) {
        names.forEach(function (name) {
          return websocket.emit(`unsubscribe:${name}`);
        });
      }
    };

    t.bindTypeParameters(this, Props);
  }

  render() {
    return this.props.children;
  }
}, _class2.propTypes = t.propTypes(Props), _class2.defaultProps = {
  visibleTimeout: 120000 // 2 minutes
}, _class2.contextTypes = {
  context: PropTypes.object
}, _temp), _descriptor = _applyDecoratedDescriptor(_class.prototype, 'subscribed', [_dec], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _class);


var index = connect()(SubscribeContainerComponent);

export default index;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
