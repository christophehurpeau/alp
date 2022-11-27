import { Form } from 'antd';
import type { ComponentProps, ComponentType, ReactElement } from 'react';
import type { UseFieldConfig } from 'react-final-form';
type FormItemProps = ComponentProps<typeof Form.Item>;
type FieldInputPropsKeys = 'onBlur' | 'onChange' | 'onFocus' | 'type' | 'value' | 'checked' | 'multiple';
interface FormFieldProps<FieldValue, P extends {
    [K in keyof P]: P[K];
}> extends UseFieldConfig<FieldValue> {
    component: ComponentType<P>;
    label?: FormItemProps['label'];
    help?: FormItemProps['help'];
    name: string;
    id?: string;
}
export default function FormField<FieldValue, P extends {
    [K in keyof P]: P[K];
}>({ component: Component, label, name, id, help, ...props }: FormFieldProps<FieldValue, P> & Omit<P, keyof FormFieldProps<FieldValue, P> | FieldInputPropsKeys>): ReactElement;
export {};
//# sourceMappingURL=FormField.d.ts.map