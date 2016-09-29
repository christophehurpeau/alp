import { PropTypes } from 'react';

LinkComponent.propTypes = {
  to: PropTypes.string,
  params: PropTypes.object,
  children: PropTypes.node,
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func,
  }),
};

type PropsType = {
  to: string,
  params: ?Object,
};

type ContextType = {
  context: {
    urlGenerator: Function,
  }
};

export default function LinkComponent(
  { to = 'default', params, children, ...props }: PropsType,
  { context: ctx }: ContextType,
) {
  return <a href={ctx.urlGenerator(to, params)} {...props}>{children}</a>;
}
