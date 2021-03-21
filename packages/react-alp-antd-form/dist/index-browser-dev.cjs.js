'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectWithoutPropertiesLoose = require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose');
var antd = require('antd');
var React = require('react');
var reactFinalForm = require('react-final-form');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _objectWithoutPropertiesLoose__default = /*#__PURE__*/_interopDefaultLegacy(_objectWithoutPropertiesLoose);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function FormField(_ref) {
  var Component = _ref.component,
      label = _ref.label,
      name = _ref.name,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? name : _ref$id,
      help = _ref.help,
      props = _objectWithoutPropertiesLoose__default(_ref, ["component", "label", "name", "id", "help"]);

  return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, /*#__PURE__*/React__default.createElement(reactFinalForm.Field, Object.assign({
    id: id,
    name: name,
    render: function render(_ref2) {
      var input = _ref2.input;
          _ref2.meta;
          var rest = _objectWithoutPropertiesLoose__default(_ref2, ["input", "meta"]);

      return /*#__PURE__*/React__default.createElement(Component, Object.assign({}, input, rest));
    }
  }, props)));
}

exports.FormField = FormField;
//# sourceMappingURL=index-browser-dev.cjs.js.map
