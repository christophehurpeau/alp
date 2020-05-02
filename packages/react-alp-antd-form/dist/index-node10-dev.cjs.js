'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const antd = require('antd');
const reactFinalForm = require('react-final-form');
const React = _interopDefault(require('react'));

function FormField({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}) {
  return /*#__PURE__*/React.createElement(antd.Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, /*#__PURE__*/React.createElement(reactFinalForm.Field, Object.assign({
    id: id,
    name: name,
    render: ({
      input,
      meta,
      ...rest
    }) => /*#__PURE__*/React.createElement(Component, Object.assign({}, input, rest))
  }, props)));
}

exports.FormField = FormField;
//# sourceMappingURL=index-node10-dev.cjs.js.map
