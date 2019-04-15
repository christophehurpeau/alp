import React, { ReactElement, ReactNode } from 'react';

export interface BodyProps {
  children: ReactNode;
}

export default ({ children }: BodyProps): ReactElement<'div'> => (
  <div>{children}</div>
);
