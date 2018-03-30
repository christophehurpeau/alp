import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'alp-react-redux';
import Logger from 'nightingale-logger';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _class, _temp2;

var logger = new Logger('react-alp-subscribe-container');

var SubscribeContainerComponent = (_temp2 = _class = function (_Component) {
  inherits(SubscribeContainerComponent, _Component);

  function SubscribeContainerComponent() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, SubscribeContainerComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = SubscribeContainerComponent.__proto__ || Object.getPrototypeOf(SubscribeContainerComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.subscribed = false, _this.timeout = null, _this.handleVisibilityChange = function () {
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
    }, _this.subscribe = function () {
      if (document.hidden) return;

      logger.log('subscribe', { names: _this.props.names, name: _this.props.name });
      _this.subscribed = true;
      var dispatch = _this.props.dispatch;

      var names = _this.props.names || [_this.props.name];
      var websocket = _this.getWebsocket();
      names.forEach(function (name) {
        return websocket.emit('subscribe:' + name).then(function (action) {
          return action && dispatch(action);
        });
      });
    }, _this.unsubscribe = function () {
      _this.timeout = null;
      if (!_this.subscribed) return;
      logger.log('unsubscribe', { names: _this.props.names, name: _this.props.name });
      _this.subscribed = false;
      var names = _this.props.names || [_this.props.name];
      var websocket = _this.getWebsocket();
      if (websocket.isConnected()) {
        names.forEach(function (name) {
          return websocket.emit('unsubscribe:' + name);
        });
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(SubscribeContainerComponent, [{
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
    key: 'getWebsocket',
    value: function getWebsocket() {
      return this.context.context.app.websocket;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return SubscribeContainerComponent;
}(Component), _class.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string,
  names: PropTypes.arrayOf(PropTypes.string.isRequired),
  children: PropTypes.node,
  visibleTimeout: PropTypes.number
}, _class.defaultProps = {
  visibleTimeout: 120000 // 2 minutes
}, _class.contextTypes = {
  context: PropTypes.object
}, _temp2);


var index = connect()(SubscribeContainerComponent);

export default index;
//# sourceMappingURL=index-browser.es.js.map
