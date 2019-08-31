'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const react = require('react');
const ReactAlpContext = _interopDefault(require('react-alp-context'));

function useT(id, params, deps) {
  const ctx = react.useContext(ReactAlpContext);
  return react.useMemo(() => {
    return ctx.t(id, params);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  !deps ? [id] : [id, ...deps]);
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
function useTs(ids) {
  const ctx = react.useContext(ReactAlpContext);
  return react.useMemo(() => {
    return ids.map(id => ctx.t(id)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);
}

function T({
  id,
  ...props
}) {
  const t = useT(id, props, Object.values(props));
  return t;
}

exports.T = T;
exports.useT = useT;
exports.useTs = useTs;
//# sourceMappingURL=index-node10-dev.cjs.js.map
