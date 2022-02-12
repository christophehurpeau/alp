import 'pob-babel';
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

export default __POB_TARGET__ === 'node'
  ? NodeSuspenseWrapper
  : BrowserSuspenseWrapper;
