var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PropTypes, Component } from 'react';
import { connect } from 'alp-react-redux';

var SubscribeContainerComponent = function (_Component) {
  _inherits(SubscribeContainerComponent, _Component);

  function SubscribeContainerComponent() {
    _classCallCheck(this, SubscribeContainerComponent);

    return _possibleConstructorReturn(this, (SubscribeContainerComponent.__proto__ || Object.getPrototypeOf(SubscribeContainerComponent)).apply(this, arguments));
  }

  _createClass(SubscribeContainerComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props;
      var dispatch = _props.dispatch;
      var name = _props.name;
      var websocket = this.context.context.app.websocket;

      this._handlerConnected = websocket.on('connect', function () {
        websocket.emit('subscribe:' + name).then(function (action) {
          return action && dispatch(action);
        });
      });
      if (websocket.isConnected()) {
        this._handlerConnected();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var name = this.props.name;
      var context = this.context.context;

      var websocket = context.app.websocket;
      if (websocket.isConnected()) {
        websocket.emit('unsubscribe:' + name);
      }

      websocket.off('connect', this._handlerConnected);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return SubscribeContainerComponent;
}(Component);

SubscribeContainerComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node
};
SubscribeContainerComponent.contextTypes = {
  context: PropTypes.object
};


export default connect()(SubscribeContainerComponent);
//# sourceMappingURL=index.js.map