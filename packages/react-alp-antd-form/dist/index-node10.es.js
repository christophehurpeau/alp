import { Form } from 'antd';
import { Field } from 'react-final-form';
import React from 'react';

function FormField({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}) {
  return React.createElement(Form.Item, {
    htmlFor: id,
    label: label,
    help: help
  }, React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: ({
      input,
      meta,
      ...rest
    }) => React.createElement(Component, Object.assign({}, input, rest))
  }, props)));
}

export { FormField };
//# sourceMappingURL=index-node10.es.js.map
