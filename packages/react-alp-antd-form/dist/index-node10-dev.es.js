import { Form } from 'antd';
import { Field } from 'react-final-form';
import React from 'react';

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-antd-form/src/FormField.tsx";
function FormField({
  component: Component,
  label,
  name,
  id = name,
  ...props
}) {
  return React.createElement(Form.Item, {
    htmlFor: id,
    label: label,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, React.createElement(Field, Object.assign({
    id: id,
    name: name,
    render: ({
      input,
      meta,
      ...rest
    }) => React.createElement(Component, Object.assign({}, input, rest, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 18
      },
      __self: this
    }))
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  })));
}

export { FormField };
//# sourceMappingURL=index-node10-dev.es.js.map