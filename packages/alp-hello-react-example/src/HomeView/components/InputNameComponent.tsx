import { Input } from 'native-base';
import type { ComponentProps, KeyboardEventHandler, ReactElement } from 'react';
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

  const handleChange: ComponentProps<typeof Input>['onChange'] = (e) => {
    setValue(e.nativeEvent.text);
    onChange(e.nativeEvent.text);
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    setValue(e.currentTarget.value);
  };

  return (
    <Input
      data-testid="input-name"
      type="text"
      autoComplete="off"
      value={value}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
    />
  );
}
