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
  deps?: ReadonlyArray<any>,
): string {
  const ctx: AlpContext = useContext(ReactAlpContext) as AlpContext;
  return useMemo(
    () => {
      return ctx.t(id, params);
    },
    !deps ? [id] : [id, ...deps],
  );
}
