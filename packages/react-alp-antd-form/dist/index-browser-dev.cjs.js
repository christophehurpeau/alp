'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose'));
var antd = require('antd');
var reactFinalForm = require('react-final-form');
var React = _interopDefault(require('react'));

var _jsxFileName = "/home/chris/libs/alp/packages/react-alp-antd-form/src/FormField.tsx";
function FormField(_ref) {
  var Component = _ref.component,
      label = _ref.label,
      name = _ref.name,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? name : _ref$id,
      help = _ref.help,
      props = _objectWithoutPropertiesLoose(_ref, ["component", "label", "name", "id", "help"]);

  return React.createElement(antd.Form.Item, {
    htmlFor: id,
    label: label,
    help: help,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, React.createElement(reactFinalForm.Field, Object.assign({
    id: id,
    name: name,
    render: function render(_ref2) {
      var input = _ref2.input,
          meta = _ref2.meta,
          rest = _objectWithoutPropertiesLoose(_ref2, ["input", "meta"]);

      return React.createElement(Component, Object.assign({}, input, rest, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 19
        },
        __self: this
      }));
    }
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  })));
}

exports.FormField = FormField;
//# sourceMappingURL=index-browser-dev.cjs.js.map
