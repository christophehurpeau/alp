'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectWithoutPropertiesLoose = require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose');
var react = require('react');
var ReactAlpContext = require('react-alp-context');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _objectWithoutPropertiesLoose__default = /*#__PURE__*/_interopDefaultLegacy(_objectWithoutPropertiesLoose);
var ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);

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

function T(_ref) {
  let id = _ref.id,
      props = _objectWithoutPropertiesLoose__default(_ref, ["id"]);

  const t = useT(id, props, Object.values(props));
  return t;
}

exports.T = T;
exports.useT = useT;
exports.useTs = useTs;
//# sourceMappingURL=index-browser.cjs.js.map
