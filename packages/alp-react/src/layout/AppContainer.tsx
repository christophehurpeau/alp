import * as React from 'react';

export interface AppContainerProps {
  children: React.ReactNode;
}

export default ({ children }: AppContainerProps) => <>{children}</>;
