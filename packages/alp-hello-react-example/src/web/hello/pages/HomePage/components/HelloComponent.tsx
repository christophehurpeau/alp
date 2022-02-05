import { styled } from '@linaria/react';
import React from 'react';
import type { ReactElement } from 'react';
import { T } from 'react-alp-translate';
import InputName from './InputNameComponent';

const Container = styled.div`
  margin: 0 auto;
  width: 60%;
  padding-top: 10%;
`;

const Hello = styled.span`
  font-size: 32px;
`;

interface HelloComponentProps {
  name: undefined | string;
  onChangeName: (name: string) => void;
}

export default function HelloComponent({
  name,
  onChangeName,
}: HelloComponentProps): ReactElement {
  return (
    <Container>
      <Hello data-testid="hello-text">
        <T id="Hello {name}!" name={name || 'World'} />
      </Hello>
      <InputName value={name} onChange={onChangeName} />
    </Container>
  );
}
