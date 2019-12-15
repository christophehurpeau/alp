'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const antd = require('antd');
const reactFinalForm = require('react-final-form');
const React = _interopDefault(require('react'));

var _jsxFileName = "/home/chris/libs/alp/packages/react-alp-antd-form/src/FormField.tsx";
function FormField({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}) {
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
    render: ({
      input,
      meta,
      ...rest
    }) => React.createElement(Component, Object.assign({}, input, rest, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19
      },
      __self: this
    }))
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  })));
}

exports.FormField = FormField;
//# sourceMappingURL=index-node10-dev.cjs.js.map
