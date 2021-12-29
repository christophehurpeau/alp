import { Form } from 'antd';
import type { ComponentProps, ComponentType, ReactElement } from 'react';
import React from 'react';
import type { UseFieldConfig } from 'react-final-form';
import { Field } from 'react-final-form';

type FormItemProps = ComponentProps<typeof Form.Item>;
type FieldInputPropsKeys =
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'type'
  | 'value'
  | 'checked'
  | 'multiple';

interface FormFieldProps<
  FieldValue,
  P extends {
    [K in keyof P]: P[K];
  },
> extends UseFieldConfig<FieldValue> {
  component: ComponentType<P>;
  label?: FormItemProps['label'];
  help?: FormItemProps['help'];
  name: string;
  id?: string;
}

export default function FormField<
  FieldValue,
  P extends {
    [K in keyof P]: P[K];
  },
>({
  component: Component,
  label,
  name,
  id = name,
  help,
  ...props
}: FormFieldProps<FieldValue, P> &
  Omit<
    P,
    keyof FormFieldProps<FieldValue, P> | FieldInputPropsKeys
  >): ReactElement {
  return (
    <Form.Item htmlFor={id} label={label} help={help}>
      <Field<FieldValue>
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
