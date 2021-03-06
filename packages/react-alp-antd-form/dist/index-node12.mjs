import { Form } from 'antd';
import React from 'react';
import { Field } from 'react-final-form';

function FormField({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}) {
  return /*#__PURE__*/React.createElement(Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, /*#__PURE__*/React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: ({
      input,
      meta,
      ...rest
    }) => /*#__PURE__*/React.createElement(Component, Object.assign({}, input, rest))
  }, props)));
}

export { FormField };
//# sourceMappingURL=index-node12.mjs.map
