'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/esm/objectWithoutPropertiesLoose'));
var react = require('react');
var ReactAlpContext = _interopDefault(require('react-alp-context'));

function useT(id, params, deps) {
  var ctx = react.useContext(ReactAlpContext);
  return react.useMemo(function () {
    return ctx.t(id, params);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  !deps ? [id] : [id].concat(deps));
}

// for params: 2 solutions: params that are send to all or mapped params.
// in both case it will be more difficult to use memo deps
function useTs(ids) {
  var ctx = react.useContext(ReactAlpContext);
  return react.useMemo(function () {
    return ids.map(function (id) {
      return ctx.t(id);
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
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
//# sourceMappingURL=index-browser-dev.cjs.js.map
