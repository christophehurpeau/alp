import { POB_TARGET } from 'pob-babel';
import type { ReactElement, ReactNode } from 'react';
import { Suspense, useContext } from 'react';
import LoadingFallbackContext from '../contexts/LoadingFallbackContext';

interface SuspenseWrapperProps {
  children: ReactNode;
}

function NodeSuspenseWrapper({ children }: SuspenseWrapperProps): ReactElement {
  return children as unknown as ReactElement;
}

function BrowserSuspenseWrapper({
  children,
}: SuspenseWrapperProps): ReactElement {
  const loader = useContext(LoadingFallbackContext);
  return <Suspense fallback={loader}>{children}</Suspense>;
}

export default POB_TARGET === 'node'
  ? NodeSuspenseWrapper
  : BrowserSuspenseWrapper;
