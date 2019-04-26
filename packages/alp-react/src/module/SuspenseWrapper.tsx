import { POB_TARGET } from 'pob-babel';
import React, { Suspense, ReactNode, useContext } from 'react';
import LoadingFallbackContext from '../contexts/LoadingFallbackContext';

interface SuspenseWrapperProps {
  children: ReactNode;
}

function NodeSuspenseWrapper({ children }: SuspenseWrapperProps) {
  return children;
}

function BrowserSuspenseWrapper({ children }: SuspenseWrapperProps) {
  const loader = useContext(LoadingFallbackContext);
  return <Suspense fallback={loader}>{children}</Suspense>;
}

export default (POB_TARGET === 'node'
  ? NodeSuspenseWrapper
  : BrowserSuspenseWrapper);
