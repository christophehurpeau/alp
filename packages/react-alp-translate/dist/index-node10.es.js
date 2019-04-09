import { useContext, useMemo } from 'react';
import ReactAlpContext from 'react-alp-context';

function useT(id, params, deps) {
  const ctx = useContext(ReactAlpContext);
  return useMemo(() => {
    return ctx.t(id, params);
  }, !deps ? [id] : [id, ...deps]);
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
function useTs(ids) {
  const ctx = useContext(ReactAlpContext);
  return useMemo(() => {
    return ids.map(id => ctx.t(id));
  }, [ids.join(',')]);
}

function T({
  id,
  ...props
}) {
  const t = useT(id, props, Object.values(props));
  return t;
}

export { T, useT, useTs };
//# sourceMappingURL=index-node10.es.js.map
