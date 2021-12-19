import type { ReactElement } from 'react';
import type React from 'react';

export interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({
  children,
}: AppContainerProps): ReactElement {
  return children as ReactElement;
}
