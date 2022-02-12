import 'pob-babel';
import type { ReactElement, ReactNode } from 'react';
import { Suspense, useContext } from 'react';
import LoadingFallbackContext from '../contexts/LoadingFallbackContext';

export interface AlpModuleProps {
  children: ReactNode;
}

function AlpModuleNode(props: AlpModuleProps): ReactElement {
  return props.children as ReactElement;
}

function AlpModuleBrowser(props: AlpModuleProps): ReactElement {
  const loadingFallback = useContext(LoadingFallbackContext);
  return <Suspense fallback={loadingFallback}>{props.children}</Suspense>;
}

export default __POB_TARGET__ === 'node' ? AlpModuleNode : AlpModuleBrowser;
