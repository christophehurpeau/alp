import { PropTypes, Component } from 'react';

export default class SubscribeContainerComponent extends Component {

    componentDidMount() {
        var _props = this.props;
        var dispatch = _props.dispatch;
        var name = _props.name;
        var websocket = this.context.context.app.websocket;

        this._handlerConnected = websocket.on('connect', () => {
            websocket.emit(`subscribe:${ name }`).then(action => {
                return action && dispatch(action);
            });
        });
        if (websocket.isConnected()) {
            this._handlerConnected();
        }
    }

    componentWillUnmount() {
        var name = this.props.name;
        var websocket = this.context.context.app.websocket;

        if (websocket.isConnected()) {
            websocket.emit(`unsubscribe:${ name }`);
        }

        websocket.off('connect', this._handlerConnected);
    }

    render() {
        return this.props.children;
    }
}
SubscribeContainerComponent.propTypes = {
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node
};
SubscribeContainerComponent.contextTypes = {
    context: PropTypes.object
};
//# sourceMappingURL=index.js.map