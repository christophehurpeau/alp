import * as React from 'react';

export interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({ children }: AppContainerProps) {
  return <>{children}</>;
}
