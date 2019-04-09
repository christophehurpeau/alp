'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var ReactAlpContext = _interopDefault(require('react-alp-context'));

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
  var ctx = react.useContext(ReactAlpContext);
  return react.useMemo(function () {
    return ctx.t(id, params);
  }, !deps ? [id] : [id].concat(deps));
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
function useTs(ids) {
  var ctx = react.useContext(ReactAlpContext);
  return react.useMemo(function () {
    return ids.map(function (id) {
      return ctx.t(id);
    });
  }, [ids.join(',')]);
}

function T(_ref) {
  var id = _ref.id,
      props = _objectWithoutPropertiesLoose(_ref, ["id"]);

  var t = useT(id, props, Object.values(props));
  return t;
}

exports.T = T;
exports.useT = useT;
exports.useTs = useTs;
//# sourceMappingURL=index-browser.cjs.js.map
