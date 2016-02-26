'use strict';

var _auk = require('auk');

var _auk2 = _interopRequireDefault(_auk);

var _aukReactRedux = require('auk-react-redux');

var _aukReactRedux2 = _interopRequireDefault(_aukReactRedux);

var _routerBuilder = require('./routerBuilder');

var _routerBuilder2 = _interopRequireDefault(_routerBuilder);

var _Html = require('./views/layouts/Html');

var _Html2 = _interopRequireDefault(_Html);

var _controllers = require('./controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _auk2.default(__dirname);
(0, _aukReactRedux2.default)(_Html2.default)(app);
app.servePublic();
app.catchErrors();
app.useRouter(_routerBuilder2.default, _controllers2.default);
app.listen();
//# sourceMappingURL=index.js.map
