'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

class SubscribeContainerComponent extends _react.Component {

    componentDidMount() {
        var _props = this.props;
        const dispatch = _props.dispatch;
        const name = _props.name;
        const websocket = this.context.context.app.websocket;

        this._handlerConnected = websocket.on('connect', () => {
            websocket.emit(`subscribe:${ name }`).then(action => action && dispatch(action));
        });
        if (websocket.isConnected()) {
            this._handlerConnected();
        }
    }

    componentWillUnmount() {
        const name = this.props.name;
        const websocket = this.context.context.app.websocket;

        if (websocket.isConnected()) {
            websocket.emit(`unsubscribe:${ name }`);
        }

        websocket.off('connect', this._handlerConnected);
    }

    render() {
        return this.props.children;
    }
}
exports.default = SubscribeContainerComponent;
SubscribeContainerComponent.propTypes = {
    dispatch: _react.PropTypes.func.isRequired,
    name: _react.PropTypes.string.isRequired,
    children: _react.PropTypes.node
};
SubscribeContainerComponent.contextTypes = {
    context: _react.PropTypes.object
};
//# sourceMappingURL=index.js.map