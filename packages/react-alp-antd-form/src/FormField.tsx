import { Form } from 'antd';
import type { ComponentProps, ComponentType, ReactElement } from 'react';
import React from 'react';
import { Field } from 'react-final-form';

type FormItemProps = ComponentProps<typeof Form.Item>;
type FieldProps = ComponentProps<typeof Field>;

interface FormFieldProps<P extends Record<string, never>> {
  component: ComponentType<P>;
  label: FormItemProps['label'];
  help: FormItemProps['help'];
  id: string;
  name: FieldProps['name'];
}

export default function FormField<P extends Record<string, never>>({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}: FormFieldProps<P>): ReactElement {
  return (
    <Form.Item htmlFor={id} label={label} help={help}>
      <Field
        id={id}
        name={name}
        render={({ input, meta, ...rest }): ReactElement => (
          <Component {...input} {...(rest as P)} />
        )}
        {...props}
      />
    </Form.Item>
  );
}
