'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _types = require('./types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactElementType = _flowRuntime2.default.tdz(() => _types.ReactElementType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject());

exports.default = function createAlpAppWrapper(app, context) {
  var _class, _temp;

  let _appType = _flowRuntime2.default.ref(ReactElementType);

  let _contextType = _flowRuntime2.default.object();

  return _flowRuntime2.default.param('app', _appType).assert(app), _flowRuntime2.default.param('context', _contextType).assert(context), (_temp = _class = class extends _react.Component {

    getChildContext() {
      const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.object());

      return _returnType.assert(context);
    }

    render() {
      const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType));

      return _returnType2.assert(app);
    }
  }, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _class.childContextTypes = {
    context: _propTypes2.default.object.isRequired,
    store: _propTypes2.default.object.isRequired,
    setModuleReducers: _propTypes2.default.func
  }, _temp);
};
//# sourceMappingURL=createAlpAppWrapper.js.map