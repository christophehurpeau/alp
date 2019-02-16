import { PRODUCTION } from 'pob-babel';
import React, { Component, ReactType } from 'react';
import ReactAlpContext from 'react-alp-context';

export interface Props {
  as?: ReactType<{ href: string }>;
  to: string;
  params?: Record<string, any>;
  children: any;
  tagName?: never;
}

export default class LinkComponent extends Component<Props> {
  static defaultProps = { as: 'a', to: 'default' };

  static contextType = ReactAlpContext;

  // eslint-disable-next-line react/sort-comp
  context!: React.ContextType<typeof ReactAlpContext>;

  render() {
    const { as, to, params, children, ...props } = this.props;

    if (!PRODUCTION && props.tagName) {
      throw new Error('`tagName` is deprecated, use `as` instead');
    }

    return React.createElement(
      as as ReactType<{ href: string }>,
      { href: this.context.urlGenerator(to, params), ...props },
      children,
    );
  }
}
