import type {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactElement} from 'react';
import React, {
  useState,
} from 'react';
import s from './InputNameComponent.scss';

interface InputNameComponentProps {
  value: undefined | string;
  onChange: (name: string) => void;
}

export default function InputNameComponent({
  value: initialValue,
  onChange,
}: InputNameComponentProps): ReactElement {
  const [value, setValue] = useState(initialValue);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log('handleChange');
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    console.log('handleKeyUp');
    setValue(e.currentTarget.value);
  };

  console.log('render InputNameComponent');
  return (
    <input
      type="text"
      autoComplete="off"
      className={s.input}
      value={value}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
    />
  );
}
