// jscs:disable maximumLineLength
'use strict';

var _get = require('babel-runtime/helpers/get').default;

var _inherits = require('babel-runtime/helpers/inherits').default;

var _createClass = require('babel-runtime/helpers/create-class').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _turacoLibTopLayout = require('turaco/lib/TopLayout');

var _turacoLibTopLayout2 = _interopRequireDefault(_turacoLibTopLayout);

/** @class Layout */
let Layout = (function (_TopLayout) {
    _inherits(Layout, _TopLayout);

    function Layout() {
        _classCallCheck(this, Layout);

        _get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Layout, [{
        key: 'head',
        /** @memberof Layout 
        * @instance 
        * @method head */value: function head() {
            return '\n    <script src="//cdn.polyfill.io/v1/polyfill.min.js?features=all"></script>\n\n    <!--Import style -->\n    <link href=\'http://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic\' rel=\'stylesheet\' type=\'text/css\'>\n    <link type="text/css" rel="stylesheet" href="/simple-blue.css"/>\n\n    <!--Let browser know website is optimized for mobile-->\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>\n        ';
        }
    }, {
        key: 'body',
        /** @memberof Layout 
        * @instance 
        * @method body 
        * @param $body 
        * @param data */value: function body($body, data) {
            const $container = $.create('div').setAttribute('class', 'container-page').appendTo($body);
            this.$content = $container;
        }
    }]);

    return Layout;
})(_turacoLibTopLayout2.default);

exports.default = Layout;
module.exports = exports.default;
//# sourceMappingURL=Layout.js.map
