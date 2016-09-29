import { PropTypes } from 'react';

TranslateComponent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func,
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired,
};

type Props = {
  id: string,
};

export default function TranslateComponent(
    { id, children, ...props }: Props,
    { context },
) {
  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return <span>{translated}</span>;
}
