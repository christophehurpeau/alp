import React from 'react';
import type { ReactElement } from 'react';
import { T } from 'react-alp-translate';
import s from './HelloComponent.scss';
import InputName from './InputNameComponent';

interface HelloComponentProps {
  name: undefined | string;
  onChangeName: (name: string) => void;
}

export default function HelloComponent({
  name,
  onChangeName,
}: HelloComponentProps): ReactElement {
  return (
    <div className={s.container}>
      <span className={s.hello}>
        <T id="Hello {name}!" name={name || 'World'} />
      </span>
      <InputName value={name} onChange={onChangeName} />
    </div>
  );
}
