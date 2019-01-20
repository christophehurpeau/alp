'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var Logger = _interopDefault(require('nightingale-logger'));
var ReactAlpContext = _interopDefault(require('react-alp-context'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var logger = new Logger('react-alp-subscribe-container');

var SubscribeContainer =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(SubscribeContainer, _Component);

  function SubscribeContainer() {
    var _this, _len, args, _key;

    for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.subscribed = false;
    _this.timeout = undefined;

    _this.handleVisibilityChange = function () {
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

    _this.subscribe = function () {
      if (document.hidden) return;
      logger.log('subscribe', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.subscribed = true;
      var names = _this.props.names || [_this.props.name];

      var websocket = _this.getWebsocket();

      names.forEach(function (name) {
        return websocket.emit("subscribe:" + name).then(_this.props.onEvent);
      });
    };

    _this.unsubscribe = function () {
      _this.timeout = undefined;
      if (!_this.subscribed) return;
      logger.log('unsubscribe', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.subscribed = false;
      var names = _this.props.names || [_this.props.name];

      var websocket = _this.getWebsocket();

      if (websocket.isConnected()) {
        names.forEach(function (name) {
          return websocket.emit("unsubscribe:" + name);
        });
      }
    };

    return _this;
  }

  var _proto = SubscribeContainer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var websocket = this.getWebsocket();
    websocket.on('connect', this.subscribe);

    if (websocket.isConnected()) {
      this.subscribe();
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange, false);
    this.getWebsocket().off('connect', this.subscribe);
    this.unsubscribe();
  };

  _proto.getWebsocket = function getWebsocket() {
    return this.context.app.websocket;
  };

  _proto.render = function render() {
    return this.props.children;
  };

  return SubscribeContainer;
}(react.Component);

SubscribeContainer.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};
SubscribeContainer.contextType = ReactAlpContext;

exports.default = SubscribeContainer;
//# sourceMappingURL=index-browser.cjs.js.map
