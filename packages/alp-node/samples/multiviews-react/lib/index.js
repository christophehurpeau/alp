'use strict';

var _auk = require('auk');

var _auk2 = _interopRequireDefault(_auk);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _aukConfig = require('auk-config');

var _aukConfig2 = _interopRequireDefault(_aukConfig);

var _aukParams = require('auk-params');

var _aukParams2 = _interopRequireDefault(_aukParams);

var _aukLanguage = require('auk-language');

var _aukLanguage2 = _interopRequireDefault(_aukLanguage);

var _aukLogger = require('auk-logger');

var _aukLogger2 = _interopRequireDefault(_aukLogger);

var _aukErrors = require('auk-errors');

var _aukErrors2 = _interopRequireDefault(_aukErrors);

var _aukTranslate = require('auk-translate');

var _aukTranslate2 = _interopRequireDefault(_aukTranslate);

var _aukLimosa = require('auk-limosa');

var _aukLimosa2 = _interopRequireDefault(_aukLimosa);

var _routerBuilder = require('./routerBuilder');

var _routerBuilder2 = _interopRequireDefault(_routerBuilder);

var _aukReactRedux = require('auk-react-redux');

var _aukReactRedux2 = _interopRequireDefault(_aukReactRedux);

var _Html = require('./views/layouts/Html');

var _Html2 = _interopRequireDefault(_Html);

var _controllers = require('./controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _auk2.default();
(0, _aukConfig2.default)(__dirname + '/config')(app);
(0, _aukParams2.default)(app);
(0, _aukLanguage2.default)(app);
(0, _aukLogger2.default)(app);
(0, _aukTranslate2.default)('locales')(app);
(0, _aukReactRedux2.default)(_Html2.default)(app);
const handler = (0, _aukLimosa2.default)(_routerBuilder2.default, _controllers2.default)(app);

app.use((0, _koaConvert2.default)((0, _koaStatic2.default)(__dirname + '/../public/'))); // static files
app.use(_aukErrors2.default);
app.use(handler);

app.listen();
//# sourceMappingURL=index.js.map
