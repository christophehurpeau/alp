import { POB_TARGET } from 'pob-babel';
import React, { ReactNode, Suspense, useContext } from 'react';
import LoadingFallbackContext from '../contexts/LoadingFallbackContext';

export interface AlpModuleProps {
  children: ReactNode;
}

function AlpModuleNode(props: AlpModuleProps): ReactNode {
  return props.children;
}

function AlpModuleBrowser(props: AlpModuleProps): ReactNode {
  const loadingFallback = useContext(LoadingFallbackContext);
  return <Suspense fallback={loadingFallback}>{props.children}</Suspense>;
}

export default (POB_TARGET === 'node' ? AlpModuleNode : AlpModuleBrowser);
