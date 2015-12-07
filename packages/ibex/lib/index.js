'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Application = (function (_EventEmitter) {
    _inherits(Application, _EventEmitter);

    function Application() {
        _classCallCheck(this, Application);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Application).call(this));

        _this.middleware = [];
        _this.context = Object.create(_context2.default);
        _this._initPromises = [];
        return _this;
    }

    _createClass(Application, [{
        key: 'init',
        value: function init(fn) {
            this._initPromises.push(fn(this));
        }
    }, {
        key: 'use',
        value: function use(fn) {
            // logger.debug('use', {name: fn._name || fn.name || '-'});
            this.middleware.push(fn);
            return this;
        }
    }, {
        key: 'onerror',
        value: function onerror(e) {
            console.log(e.stack || e.message || e);
        }
    }, {
        key: 'run',
        value: function run() {
            var _this2 = this;

            return Promise.all(this._initPromises).then(function () {
                delete _this2._initPromises;

                if (!_this2.listeners('error').length) {
                    _this2.on('error', _this2.onerror);
                }

                _this2.callback = (0, _compose2.default)(_this2.middleware);
            });
        }
    }, {
        key: 'load',
        value: function load(url) {
            if (url.startsWith('?')) {
                url = window.location.pathname + url;
            }

            var ctx = null;
            this.callback.call(ctx).then(function () {
                return respond.call(ctx);
            }).catch(ctx.onerror);
        }
    }, {
        key: 'environment',
        get: function get() {
            return this.env;
        }
    }]);

    return Application;
})(_events.EventEmitter);

exports.default = Application;

function respond() {
    // allow bypassing
    if (this.respond === false) {
        return;
    }

    if (!this.writable) return;

    var body = this.body;
    // let code = this.status;

    if (typeof body === 'string') {
        document.body.innerHTML = body;
        return;
    }

    if (body.nodeType) {
        document.body.innerHTML = '';
        document.body.appendChild(body);
    }

    throw new Error('Invalid body result');
}
//# sourceMappingURL=index.js.map