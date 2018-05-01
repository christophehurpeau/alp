import { PRODUCTION } from 'pob-babel';
import React, { ComponentType } from 'react';
import PropTypes from 'prop-types';

export interface Props {
  as?: ComponentType<{ href: string }>;
  to: string;
  params?: Object;
  children: any;
  tagName?: never;
}

export interface Context {
  urlGenerator: Function;
}

export interface ContextType {
  context: Context;
}

const LinkComponent: ComponentType<Props> = (
  { as: Type = 'a', to = 'default', params, children, ...props }: Props,
  { context: ctx }: ContextType,
) => {
  if (!PRODUCTION && props.tagName) throw new Error('`tagName` is deprecated, use `as` instead');
  return (
    <Type href={ctx.urlGenerator(to, params)} {...props}>
      {children}
    </Type>
  );
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func,
  }),
};

export default LinkComponent;
