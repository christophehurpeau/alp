'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _class, _temp;

var _react = require('react');

var _alpReactRedux = require('alp-react-redux');

let SubscribeContainerComponent = (_temp = _class = class extends _react.Component {

  componentDidMount() {
    const { dispatch, name } = this.props;
    const { context: { app: { websocket } } } = this.context;
    this._handlerConnected = websocket.on('connect', () => {
      websocket.emit(`subscribe:${name}`).then(action => action && dispatch(action));
    });
    if (websocket.isConnected()) {
      this._handlerConnected();
    }
  }

  componentWillUnmount() {
    const { name } = this.props;
    const { context } = this.context;
    const websocket = context.app.websocket;
    if (websocket.isConnected()) {
      websocket.emit(`unsubscribe:${name}`);
    }

    websocket.off('connect', this._handlerConnected);
  }

  render() {
    return this.props.children;
  }
}, _class.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  name: _react.PropTypes.string.isRequired,
  children: _react.PropTypes.node
}, _class.contextTypes = {
  context: _react.PropTypes.object
}, _temp);
exports.default = (0, _alpReactRedux.connect)()(SubscribeContainerComponent);
//# sourceMappingURL=index.js.map