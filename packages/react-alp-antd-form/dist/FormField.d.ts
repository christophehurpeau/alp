import { Form } from 'antd';
import type { ComponentProps, ComponentType, ReactElement } from 'react';
import type { UseFieldConfig } from 'react-final-form';
declare type FormItemProps = ComponentProps<typeof Form.Item>;
interface FormFieldProps<FieldValue, P> extends UseFieldConfig<FieldValue> {
    component: ComponentType<P>;
    label: FormItemProps['label'];
    help: FormItemProps['help'];
    name: string;
    id?: string;
}
export default function FormField<FieldValue, P>({ component: Component, label, name, id, help, ...props }: FormFieldProps<FieldValue, P> & Omit<P, keyof FormFieldProps<FieldValue, P>>): ReactElement;
export {};
//# sourceMappingURL=FormField.d.ts.map