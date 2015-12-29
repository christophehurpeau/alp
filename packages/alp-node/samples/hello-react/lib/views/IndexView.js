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

        const dispatch = this.context.context.store.dispatch;
        const title = 'Hello ' + name;
        this.context.setTitle(title);
        return _react2.default.createElement(_HelloComponent2.default, { name: name, setName: name => dispatch((0, _name.setName)(name)) });
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
