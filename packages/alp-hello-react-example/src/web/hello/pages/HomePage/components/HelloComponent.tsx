import React from 'react';
import { T } from 'react-alp-translate';
import InputName from './InputNameComponent';
import s from './HelloComponent.scss';

interface Props {
  name: undefined | string;
  onChangeName: (name: string) => void;
}

export default function HelloComponent({ name, onChangeName }: Props) {
  return (
    <div className={s.container}>
      <span className={s.hello}>
        <T id="Hello {name}!" name={name || 'World'} />
      </span>
      <InputName value={name} onChange={onChangeName} />
    </div>
  );
}
