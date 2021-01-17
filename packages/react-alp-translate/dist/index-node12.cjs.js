'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const react = require('react');
const ReactAlpContext = require('react-alp-context');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);

function useT(id, params, deps) {
  const ctx = react.useContext(ReactAlpContext__default);
  return react.useMemo(() => {
    return ctx.t(id, params);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-unsafe-assignment
  !deps ? [id] : [id, ...deps]);
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
function useTs(ids) {
  const ctx = react.useContext(ReactAlpContext__default);
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
//# sourceMappingURL=index-node12.cjs.js.map
