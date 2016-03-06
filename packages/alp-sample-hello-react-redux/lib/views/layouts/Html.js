'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Html = (_temp = _class = class Html extends _react.Component {

    render() {
        return _react2.default.createElement(
            'html',
            { className: 'no-js', lang: '' },
            _react2.default.createElement(
                'head',
                null,
                _react2.default.createElement('meta', { charSet: 'utf-8' }),
                _react2.default.createElement('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }),
                _react2.default.createElement(
                    'title',
                    null,
                    this.props.title
                ),
                _react2.default.createElement('meta', { name: 'description', content: this.props.description }),
                _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
                _react2.default.createElement('link', { rel: 'apple-touch-icon', href: 'apple-touch-icon.png' }),
                _react2.default.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic', rel: 'stylesheet', type: 'text/css' }),
                _react2.default.createElement('link', { rel: 'stylesheet', href: '/index.css' }),
                _react2.default.createElement('style', { id: 'css', dangerouslySetInnerHTML: { __html: this.props.css } }),
                _react2.default.createElement('script', { defer: true, src: '/bundle.js' }),
                _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: `window.VERSION = '${ this.props.context.config.get('version') }';` + `window.initialData = ${ JSON.stringify(this.props.initialData) }`
                    }
                })
            ),
            _react2.default.createElement(
                'body',
                null,
                _react2.default.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: this.props.body } })
            )
        );
    }
}, _class.propTypes = {
    title: _react.PropTypes.string,
    description: _react.PropTypes.string,
    css: _react.PropTypes.string,
    body: _react.PropTypes.string.isRequired,
    initialData: _react.PropTypes.object.isRequired,
    context: _react.PropTypes.object.isRequired
}, _class.defaultProps = {
    title: '',
    description: ''
}, _temp);
exports.default = Html;
//# sourceMappingURL=Html.js.map
