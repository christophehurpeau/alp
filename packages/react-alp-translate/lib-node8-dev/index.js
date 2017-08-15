'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ChildrenCallbackType = _flowRuntime2.default.type('ChildrenCallbackType', _flowRuntime2.default.function(_flowRuntime2.default.param('translated', _flowRuntime2.default.string()), _flowRuntime2.default.return(_flowRuntime2.default.void())));

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('id', _flowRuntime2.default.string()), _flowRuntime2.default.property('as', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('children', _flowRuntime2.default.nullable(ChildrenCallbackType)), _flowRuntime2.default.indexer('key', _flowRuntime2.default.string(), _flowRuntime2.default.any())));

const TranslateComponent = (_arg, _arg2) => {
  let _PropsType$assert = PropsType.assert(_arg),
      { id, as: AsType = 'span', children } = _PropsType$assert,
      props = _objectWithoutProperties(_PropsType$assert, ['id', 'as', 'children']);

  let { context } = _arg2;

  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return _react2.default.createElement(
    AsType,
    null,
    translated
  );
};

TranslateComponent.contextTypes = {
  context: _propTypes2.default.object.isRequired
};

exports.default = TranslateComponent;
//# sourceMappingURL=index.js.map