import { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from './types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
const ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
const PropsType = t.type('PropsType', t.exactObject());


export default (function createAlpAppWrapper(app, context) {
  var _class, _temp;

  let _appType = t.ref(ReactElementType);

  let _contextType = t.object();

  return t.param('app', _appType).assert(app), t.param('context', _contextType).assert(context), (_temp = _class = class extends Component {

    getChildContext() {
      const _returnType = t.return(t.object());

      return _returnType.assert(context);
    }

    render() {
      const _returnType2 = t.return(t.ref(ReactNodeType));

      return _returnType2.assert(app);
    }
  }, _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp);
});
//# sourceMappingURL=createAlpAppWrapper.js.map