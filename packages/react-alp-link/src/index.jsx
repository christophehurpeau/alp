import { PropTypes } from 'react';

type PropsType = {
  tagName: ?string,
  to: string,
  params: ?Object,
  children: ?any,
};

type ContextType = {
  context: {
    urlGenerator: Function,
  }
};

const LinkComponent = (
  { tagName: TagName = 'a', to = 'default', params, children, ...props }: PropsType,
  { context: ctx }: ContextType,
) => (
  <TagName href={ctx.urlGenerator(to, params)} {...props}>{children}</TagName>
);

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func,
  }),
};

export default LinkComponent;
