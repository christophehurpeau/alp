import { Input } from 'native-base';
import type { ReactElement } from 'react';
import { useState } from 'react';

interface InputNameComponentProps {
  value: undefined | string;
  onChange: (name: string) => void;
}

export default function InputNameComponent({
  value: initialValue,
  onChange,
}: InputNameComponentProps): ReactElement {
  const [value, setValue] = useState(initialValue);

  return (
    <Input
      variant="outline"
      data-testid="input-name"
      type="text"
      autoComplete="off"
      value={value}
      onChangeText={(newValue) => {
        setValue(newValue);
        onChange(newValue);
      }}
    />
  );
}
