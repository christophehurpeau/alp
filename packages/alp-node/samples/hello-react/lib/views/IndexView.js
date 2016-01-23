'use strict';

var _class, _temp;

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _HelloComponent = require('./components/HelloComponent');

var _HelloComponent2 = _interopRequireDefault(_HelloComponent);

var _name = require('../actions/name');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let IndexView = (_temp = _class = class IndexView extends _react.Component {

    render() {
        const name = this.props.name;

        const title = 'Hello ' + name;
        this.context.setTitle(title);
        return _react2.default.createElement(_HelloComponent2.default, { name: name, setName: name => this.setName(name) });
    }

    setName(name) {
        const dispatch = this.context.context.store.dispatch;
        dispatch((0, _name.setName)(name));
    }

    componentDidMount() {
        const store = this.context.context.store;
        store.subscribe(this._storeListener = () => {
            const state = store.getState();

            const queryParams = new URLSearchParams(!location.search.length ? location.search : location.search.substr(1));
            if (!state.name) {
                queryParams.delete('name');
            } else {
                queryParams.set('name', state.name);
            }

            const queryString = queryParams.toString();
            if (queryString !== location.query) {
                history.replaceState({ name: state.name }, document.title, (location.pathname.slice(0, -(location.search.length - 1)) || '/') + (queryString && '?' + queryString));
            }
        });
    }

    componentWillUnmount() {
        const store = this.context.context.store;
        if (this._storeListener) {
            store.unsubscribe(this._storeListener);
        }
    }
}, _class.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
}, _class.propTypes = {
    name: _react.PropTypes.string
}, _temp);
exports.default = (0, _reactRedux.connect)(state => ({
    name: state.name
}))(IndexView);
//# sourceMappingURL=IndexView.js.map
