import { PropTypes } from 'react';
import type { TagNameOrReactComponentType } from 'alp-react-redux/src/types';

type PropsType = {
  as: ?TagNameOrReactComponentType,
  to: string,
  params: ?Object,
  children: ?any,
};

type ContextType = {
  context: {
    urlGenerator: Function,
  },
};

const LinkComponent = (
  { as: Type = 'a', to = 'default', params, children, ...props }: PropsType,
  { context: ctx }: ContextType,
) => {
  if (!PRODUCTION && props.tagName) throw new Error('`tagName` is deprecated, use `as` instead');
  return <Type href={ctx.urlGenerator(to, params)} {...props}>{children}</Type>;
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func,
  }),
};

export default LinkComponent;
