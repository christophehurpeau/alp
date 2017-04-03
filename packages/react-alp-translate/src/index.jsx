import { PropTypes } from 'react';

type ChildrenCallbackType = (translated: string) => void;

type PropsType = {
  id: string,
  children: ?ChildrenCallbackType,
};

const TranslateComponent = (
  { id, children, ...props }: PropsType,
  { context },
) => {
  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return <span>{translated}</span>;
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired,
};

export default TranslateComponent;
