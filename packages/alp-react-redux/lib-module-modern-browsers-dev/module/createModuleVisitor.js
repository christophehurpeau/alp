// import AppContainer from '../layout/AppContainer';
import AlpModule from './AlpModule';

export default (function createModuleVisitor() {
  let reducers;

  return {
    visitor: function visitor(element, instance) {
      // console.log(element, instance, instance instanceof AlpModule, element.type === AppContainer);

      if (instance && instance instanceof AlpModule) {
        reducers = instance.props.reducers;
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