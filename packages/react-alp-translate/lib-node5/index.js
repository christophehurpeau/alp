'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = TranslateComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

TranslateComponent.propTypes = {
    id: _react.PropTypes.string
};

TranslateComponent.contextTypes = {
    context: _react.PropTypes.object.isRequired
};

function TranslateComponent(_ref, _ref2) {
    let id = _ref.id;

    let props = _objectWithoutProperties(_ref, ['id']);

    let context = _ref2.context;

    return _react2.default.createElement(
        'span',
        null,
        context.t(id)
    );
}
//# sourceMappingURL=index.js.map