/* eslint-disable react/forbid-prop-types */
import { PropTypes } from 'react';

type PropsType = {
  to: string,
  params: ?Object,
};

type ContextType = {
  context: {
    urlGenerator: Function,
  }
};

const LinkComponent = (
  { to = 'default', params, children, ...props }: PropsType,
  { context: ctx }: ContextType,
) => (
  <a href={ctx.urlGenerator(to, params)} {...props}>{children}</a>
);

LinkComponent.propTypes = {
  to: PropTypes.string.isRequired,
  params: PropTypes.object,
  children: PropTypes.node,
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func,
  }),
};

export default LinkComponent;
