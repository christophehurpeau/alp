import { Input } from 'native-base';
import type { ComponentProps, KeyboardEventHandler, ReactElement } from 'react';
import { useState } from 'react';

// const Input = styled.input`
//   width: 100%;
//   font-size: 1.5rem;
//   margin-top: 2rem;
// `;

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
    setValue(e.target.value);
    onChange(e.target.value);
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
