'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var PropTypes = _interopDefault(require('prop-types'));
var Logger = _interopDefault(require('nightingale-logger'));
var reactRedux = require('react-redux');

function _inheritsLoose(subClass, superClass) {
  subClass.prototype.__proto__ = superClass && superClass.prototype;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var logger = new Logger('react-alp-subscribe-container');

var SubscribeContainer =
/*#__PURE__*/
function (_Component) {
  function SubscribeContainer() {
    var _temp, _this, _len, args, _key;

    for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _Component.call.apply(_Component, [this].concat(args)) || this, _this.subscribed = false, _this.timeout = undefined, _this.handleVisibilityChange = function () {
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
    }, _this.subscribe = function () {
      if (document.hidden) return;
      logger.log('subscribe', {
        names: _this.props.names,
        name: _this.props.name
      });
      _this.subscribed = true;
      var dispatch = _this.props.dispatch;
      var names = _this.props.names || [_this.props.name];

      var websocket = _this.getWebsocket();

      names.forEach(function (name) {
        return websocket.emit("subscribe:" + name).then(function (action) {
          return action && dispatch(action);
        });
      });
    }, _this.unsubscribe = function () {
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
    }, _temp) || _assertThisInitialized(_this);
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
    return this.context.context.app.websocket;
  };

  _proto.render = function render() {
    return this.props.children;
  };

  _inheritsLoose(SubscribeContainer, _Component);

  return SubscribeContainer;
}(react.Component);

SubscribeContainer.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};
SubscribeContainer.contextTypes = {
  context: PropTypes.object
};

var SubscribeContainerConnected = reactRedux.connect()(SubscribeContainer);

exports.default = SubscribeContainerConnected;
//# sourceMappingURL=index-browser-dev.cjs.js.map
