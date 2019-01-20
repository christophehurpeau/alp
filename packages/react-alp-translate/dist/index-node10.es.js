import { Component } from 'react';
import ReactAlpContext from 'react-alp-context';

class Translate extends Component {
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

export default Translate;
//# sourceMappingURL=index-node10.es.js.map
