import { Form } from 'antd';
import type { ComponentProps, ComponentType, ReactElement } from 'react';
import { Field } from 'react-final-form';
declare type FormItemProps = ComponentProps<typeof Form.Item>;
declare type FieldProps = ComponentProps<typeof Field>;
interface FormFieldProps<P extends Record<string, never>> {
    component: ComponentType<P>;
    label: FormItemProps['label'];
    help: FormItemProps['help'];
    id: string;
    name: FieldProps['name'];
}
export default function FormField<P extends Record<string, never>>({ component: Component, label, name, id, help, ...props }: FormFieldProps<P>): ReactElement;
export {};
//# sourceMappingURL=FormField.d.ts.map