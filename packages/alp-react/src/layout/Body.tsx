import type { ReactElement, ReactNode } from 'react';
import React from 'react';

export interface BodyProps {
  children: ReactNode;
}

export default function Body({ children }: BodyProps): ReactElement<'div'> {
  return <div>{children}</div>;
}
