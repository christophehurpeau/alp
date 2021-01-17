'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const antd = require('antd');
const React = require('react');
const reactFinalForm = require('react-final-form');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function FormField({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}) {
  return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, /*#__PURE__*/React__default.createElement(reactFinalForm.Field, Object.assign({
    id: id,
    name: name,
    render: ({
      input,
      meta,
      ...rest
    }) => /*#__PURE__*/React__default.createElement(Component, Object.assign({}, input, rest))
  }, props)));
}

exports.FormField = FormField;
//# sourceMappingURL=index-node12-dev.cjs.js.map
