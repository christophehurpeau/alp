'use strict';

var _alp = require('alp');

var _alp2 = _interopRequireDefault(_alp);

var _alpReactRedux = require('alp-react-redux');

var _alpReactRedux2 = _interopRequireDefault(_alpReactRedux);

var _routerBuilder = require('./routerBuilder');

var _routerBuilder2 = _interopRequireDefault(_routerBuilder);

var _Html = require('./views/layouts/Html');

var _Html2 = _interopRequireDefault(_Html);

var _controllers = require('./controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _config = require('./server/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _alp2.default({
    srcDirname: __dirname,
    packageDirname: `${ __dirname }/..`,
    config: _config2.default
});

// config / init
(0, _alpReactRedux2.default)(_Html2.default)(app);

// middlewares
app.servePublic();
app.catchErrors();
app.useRouter(_routerBuilder2.default, _controllers2.default);

app.listen();
//# sourceMappingURL=index.js.map
