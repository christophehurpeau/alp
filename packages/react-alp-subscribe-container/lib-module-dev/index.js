var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _descriptor, _class2, _temp2;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

import { PropTypes, Component } from 'react';
import { connect } from 'alp-react-redux';
import Logger from 'nightingale-logger';

import t from 'flow-runtime';
var logger = new Logger('react-alp-subscribe-container');

var SubscribeContainerComponent = (_dec = t.decorate(t.boolean()), (_class = (_temp2 = _class2 = function (_Component) {
  _inherits(SubscribeContainerComponent, _Component);

  function SubscribeContainerComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SubscribeContainerComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SubscribeContainerComponent.__proto__ || Object.getPrototypeOf(SubscribeContainerComponent)).call.apply(_ref, [this].concat(args))), _this), _initDefineProp(_this, 'subscribed', _descriptor, _this), _this.timeout = null, _this.state = {}, _this.handleVisibilityChange = function () {
      if (!document.hidden) {
        if (_this.timeout) {
          logger.log('timeout cleared', { name: _this.props.name });
          clearTimeout(_this.timeout);
        } else {
          logger.debug('resubscribe', { name: _this.props.name });
          _this.subscribe();
        }
        return;
      }

      if (!_this.subscribed) return;

      logger.log('timeout visible', { name: _this.props.name });
      _this.timeout = setTimeout(_this.unsubscribe, _this.props.visibleTimeout);
    }, _this.subscribe = function () {
      if (document.hidden) return;

      logger.log('subscribe', { name: _this.props.name });
      _this.subscribed = true;
      var _this$props = _this.props,
          dispatch = _this$props.dispatch,
          name = _this$props.name;

      var websocket = _this.getWebsocket();
      websocket.emit('subscribe:' + name).then(function (action) {
        return action && dispatch(action);
      });
    }, _this.unsubscribe = function () {
      _this.timeout = null;
      if (!_this.subscribed) return;
      logger.log('unsubscribe', { name: _this.props.name });
      _this.subscribed = false;
      var name = _this.props.name;

      var websocket = _this.getWebsocket();
      if (websocket.isConnected()) {
        websocket.emit('unsubscribe:' + name);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SubscribeContainerComponent, [{
    key: 'getWebsocket',
    value: function getWebsocket() {
      return this.context.context.app.websocket;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var websocket = this.getWebsocket();
      websocket.on('connect', this.subscribe);
      if (websocket.isConnected()) {
        this.subscribe();
      }
      document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange, false);
      this.getWebsocket().off('connect', this.subscribe);
      this.unsubscribe();
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return SubscribeContainerComponent;
}(Component), _class2.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  visibleTimeout: PropTypes.number
}, _class2.defaultProps = {
  visibleTimeout: 120000 }, _class2.contextTypes = {
  context: PropTypes.object
}, _temp2), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'subscribed', [_dec], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
})), _class));


export default connect()(SubscribeContainerComponent);
//# sourceMappingURL=index.js.map