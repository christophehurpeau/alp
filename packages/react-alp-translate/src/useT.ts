import { useContext, useMemo } from 'react';
import ReactAlpContext from 'react-alp-context';

interface Params {
  [key: string]: any;
}

declare module 'alp-types' {
  export interface Context {
    t: (id: string, params?: Params) => string;
  }
}

function useT(id: string): string;
function useT(id: string, params: Params, deps: readonly any[]): string;
function useT(id: string, params?: Params, deps?: readonly any[]): string {
  const ctx = useContext(ReactAlpContext);
  return useMemo(
    () => {
      return ctx.t(id, params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    !deps ? [id] : [id, ...deps],
  );
}

export default useT;
