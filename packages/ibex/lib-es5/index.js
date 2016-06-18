'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _events = require('events');

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _nightingaleLogger2.default('ibex');

var Application = function (_EventEmitter) {
    _inherits(Application, _EventEmitter);

    function Application() {
        _classCallCheck(this, Application);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Application).call(this));

        _this.middleware = [];
        _this.context = Object.create(_context2.default);
        return _this;
    }

    _createClass(Application, [{
        key: 'use',
        value: function use(fn) {
            logger.debug('use', { name: fn.name || '-' });
            this.middleware.push(fn);
            return this;
        }
    }, {
        key: 'onerror',
        value: function onerror(e) {
            logger.error(e);
        }
    }, {
        key: 'run',
        value: function run(url) {
            if (!this.listeners('error').length) {
                this.on('error', this.onerror);
            }

            this.callback = (0, _compose2.default)(this.middleware);

            if (url) {
                this.load(url);
            }
        }
    }, {
        key: 'createContext',
        value: function createContext() {
            var context = Object.create(this.context);
            context.state = {};
            return context;
        }
    }, {
        key: 'load',
        value: function load(url) {
            var _this2 = this;

            logger.debug('load', { url: url });

            if (url.startsWith('?')) {
                url = window.location.pathname + url;
            }

            var context = this.createContext();
            context.path = url;
            this.callback.call(context).then(function () {
                return respond.call(context);
            }).catch(function (err) {
                return _this2.emit('error', err);
            });
        }
    }, {
        key: 'environment',
        get: function get() {
            return this.env;
        }
    }]);

    return Application;
}(_events.EventEmitter);

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