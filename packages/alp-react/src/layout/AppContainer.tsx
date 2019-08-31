import React, { ReactElement } from 'react';

export interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({
  children,
}: AppContainerProps): ReactElement {
  return <>{children}</>;
}
