import { useContext, useMemo } from 'react';
import ReactAlpContext from 'react-alp-context';

interface Params {
  [key: string]: any;
}

interface AlpContext {
  t: (id: string, params?: Params) => string;
}

export default function useT(
  id: string,
  params?: { [key: string]: any },
  deps?: readonly any[],
): string {
  const ctx = useContext(ReactAlpContext);
  return useMemo(
    () => {
      return ctx.t(id, params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    !deps ? [id] : [id, ...deps],
  );
}
