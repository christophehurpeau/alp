import React, { ReactElement, ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export default ({ children }: Props): ReactElement<'div'> => (
  <div>{children}</div>
);
