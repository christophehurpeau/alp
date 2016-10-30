import { PropTypes } from 'react';

type Props = {
  id: string,
};

const TranslateComponent = (
  { id, children, ...props }: Props,
  { context },
) => {
  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return <span>{translated}</span>;
};

TranslateComponent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func,
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired,
};

export default TranslateComponent;
