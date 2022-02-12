import { Form } from 'antd';
import { Field } from 'react-final-form';
import { jsx } from 'react/jsx-runtime';

function FormField({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}) {
  return /*#__PURE__*/jsx(Form.Item, {
    htmlFor: id,
    label: label,
    help: help,
    children: /*#__PURE__*/jsx(Field, {
      id: id,
      name: name,
      render: ({
        input,
        meta,
        ...rest
      }) => /*#__PURE__*/jsx(Component, { ...input,
        ...rest
      }),
      ...props
    })
  });
}

export { FormField };
//# sourceMappingURL=index-browsermodern.es.js.map
