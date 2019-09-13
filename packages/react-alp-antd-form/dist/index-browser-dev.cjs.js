'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose'));
var antd = require('antd');
var reactFinalForm = require('react-final-form');
var React = _interopDefault(require('react'));

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-antd-form/src/FormField.tsx";
function FormField(_ref) {
  var Component = _ref.component,
      label = _ref.label,
      name = _ref.name,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? name : _ref$id,
      props = _objectWithoutPropertiesLoose(_ref, ["component", "label", "name", "id"]);

  return React.createElement(antd.Form.Item, {
    htmlFor: id,
    label: label,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
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
          lineNumber: 18
        },
        __self: this
      }));
    }
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  })));
}

exports.FormField = FormField;
//# sourceMappingURL=index-browser-dev.cjs.js.map
