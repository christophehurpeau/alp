import { useContext, useMemo } from 'react';
import ReactAlpContext from 'react-alp-context';

interface AlpContext {
  t: (id: string, params?: { [key: string]: any }) => string;
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
export default function useTs(ids: string[]): string[] {
  const ctx: AlpContext = useContext(ReactAlpContext);
  return useMemo(() => {
    return ids.map((id) => ctx.t(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);
}
