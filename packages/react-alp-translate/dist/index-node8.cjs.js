'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var ReactAlpContext = _interopDefault(require('react-alp-context'));

class Translate extends React.Component {
  render() {
    const {
      id,
      children,
      ...props
    } = this.props;
    const translated = this.context.t(id, props);

    if (children) {
      return children(translated);
    }

    return translated;
  }

}
Translate.contextType = ReactAlpContext;

exports.default = Translate;
//# sourceMappingURL=index-node8.cjs.js.map
