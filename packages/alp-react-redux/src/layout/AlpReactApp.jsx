import { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import type { ReactNodeType } from '../types';

type PropsType = {|
  children: ?ReactNodeType,
|};

export default class App extends Component {
  static childContextTypes = {
    context: PropTypes.object.isRequired,
  };

  getChildContext(): Object {
    return { context: this.props.context };
  }

  props: PropsType;

  render(): ReactNodeType {
    const { children } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        {children}
      </div>
    );
  }
}
