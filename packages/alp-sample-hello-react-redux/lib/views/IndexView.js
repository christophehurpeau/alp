'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _HelloComponent = require('./components/HelloComponent');

var _HelloComponent2 = _interopRequireDefault(_HelloComponent);

var _name = require('./actions/name');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactRedux.connect)(_ref => {
    let name = _ref.name;
    return { name: name };
})((_temp2 = _class = class IndexView extends _react.Component {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.setName = name => {
            if (!(typeof name === 'string')) {
                throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
            }

            if (this.props.name === name) return;
            const dispatch = this.context.context.store.dispatch;
            dispatch((0, _name.setName)(name));
        }, _temp;
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
                history.replaceState({ name: state.name }, document.title, (location.pathname.slice(0, -(location.search.length - 1)) || '/') + (queryString && `?${ queryString }`));
            }
        });
    }

    componentWillUnmount() {
        const store = this.context.context.store;
        if (this._storeListener) {
            store.unsubscribe(this._storeListener);
        }
    }

    render() {
        const name = this.props.name;

        const title = this.context.context.t('Hello {name}!', { name: name || 'World' });
        this.context.setTitle(title);
        return _react2.default.createElement(_HelloComponent2.default, { name: name, setName: this.setName });
    }
}, _class.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
}, _class.propTypes = {
    name: _react.PropTypes.string
}, _temp2));

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=IndexView.js.map
