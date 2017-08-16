// import AppContainer from '../layout/AppContainer';
import AlpModule from './AlpModule';

export default (function createModuleVisitor() {
  let reducers;

  return {
    visitor: (element, instance) => instance && instance instanceof AlpModule ? (reducers = instance.props.reducers, false) : true,

    getReducers: () => reducers
  };
});
//# sourceMappingURL=createModuleVisitor.js.map