import { Form } from 'antd';
import { Field } from 'react-final-form';
import React, { ReactElement } from 'react';

export default function FormField({
  component: Component,
  label,
  name,
  id = name,
  ...props
}: any): ReactElement {
  return (
    <Form.Item htmlFor={id} label={label}>
      <Field
        id={id}
        name={name}
        render={({ input, meta, ...rest }): ReactElement => (
          <Component {...input} {...rest} />
        )}
        {...props}
      />
    </Form.Item>
  );
}