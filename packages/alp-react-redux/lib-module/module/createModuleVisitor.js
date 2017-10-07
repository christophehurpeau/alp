var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// import AppContainer from '../layout/AppContainer';
import AlpModule from './AlpModule';

export default (function () {
  var reducers = void 0;

  return {
    visitor: function visitor(element, instance) {
      // console.log(element, instance, instance instanceof AlpModule, element.type === AppContainer);

      if (instance && instance instanceof AlpModule) {
        var _instance$props = _slicedToArray(instance.props, 1);

        reducers = _instance$props[0];

        return false;
      }

      return true;
    },

    getReducers: function getReducers() {
      return reducers;
    }
  };
});
//# sourceMappingURL=createModuleVisitor.js.map