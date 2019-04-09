import { useContext, useMemo } from 'react';
import ReactAlpContext from 'react-alp-context';

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function useT(id, params, deps) {
  const ctx = useContext(ReactAlpContext);
  return useMemo(function () {
    return ctx.t(id, params);
  }, !deps ? [id] : [id, ...deps]);
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
function useTs(ids) {
  const ctx = useContext(ReactAlpContext);
  return useMemo(function () {
    return ids.map(function (id) {
      return ctx.t(id);
    });
  }, [ids.join(',')]);
}

function T(_ref) {
  let {
    id
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["id"]);

  const t = useT(id, props, Object.values(props));
  return t;
}

export { T, useT, useTs };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
