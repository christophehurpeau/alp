import type { ReactElement } from 'react';
import { useState } from 'react';
import { Input } from 'tamagui';

interface InputNameComponentProps {
  value: string | undefined;
  onChange: (name: string) => void;
}

export default function InputNameComponent({
  value: initialValue,
  onChange,
}: InputNameComponentProps): ReactElement {
  const [value, setValue] = useState(initialValue);

  return (
    <Input
      // https://github.com/tamagui/tamagui/issues/1329
      testID="input-name"
      autoComplete="off"
      aria-label="Input your name"
      value={value}
      onChangeText={(newValue) => {
        setValue(newValue);
        onChange(newValue);
      }}
    />
  );
}
