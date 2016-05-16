'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpReactRedux;

var _fody = require('fody');

var _fody2 = _interopRequireDefault(_fody);

var _fodyApp = require('fody-app');

var _fodyApp2 = _interopRequireDefault(_fodyApp);

var _fodyReduxApp = require('fody-redux-app');

var _fodyReduxApp2 = _interopRequireDefault(_fodyReduxApp);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _redux = require('redux');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _nightingaleLogger2.default('alp.react-redux');

// https://www.npmjs.com/package/babel-preset-modern-browsers
var agents = [{ name: 'Edge', regexp: /edge\/([\d]+)/i, modernMinVersion: 13 }, { name: 'Firefox', regexp: /firefox\/([\d]+)/i, modernMinVersion: 45 }, { name: 'Chrome', regexp: /chrome\/([\d]+)/i, modernMinVersion: 41 }, // also works for opera.
{ name: 'Chromium', regexp: /chromium\/([\d]+)/i, modernMinVersion: 41 }];

/**
 * @function
 * @param Html
*/
// { name: 'Safari', regexp: /safari.*version\/([\d\w\.\-]+)/i, modernMinVersion: 10 },
function alpReactRedux(Html) {
    return function (app) {
        app.context.render = /**
                              * @function
                              * @param moduleDescriptor
                              * @param data
                             */function (moduleDescriptor, data) {
            var _this = this;

            logger.debug('render view', { data: data });

            if (moduleDescriptor.reducer) {
                this.store = (0, _redux.createStore)(moduleDescriptor.reducer, data);
            }

            this.body = (0, _fody2.default)({
                htmlData: {
                    context: this,
                    moduleDescriptor: moduleDescriptor,
                    get scriptName() {
                        // TODO create alp-useragent with getter in context
                        var ua = this.context.req.headers['user-agent'];

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = agents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var agent = _step.value;

                                var res = agent.regexp.exec(ua);
                                if (res && res[1] >= agent.modernMinVersion) {
                                    return 'modern-browsers';
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return 'es5';
                    }
                },
                context: this,
                View: moduleDescriptor.View,
                data: moduleDescriptor.reducer ? undefined : data,
                initialData: moduleDescriptor.reducer ? function () {
                    return _this.store.getState();
                } : function () {
                    return null;
                },
                Html: Html,
                App: moduleDescriptor.reducer ? _fodyReduxApp2.default : _fodyApp2.default
            });
        };
    };
}
//# sourceMappingURL=node.js.map