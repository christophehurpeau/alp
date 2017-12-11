import PropTypes from 'prop-types';

type ChildrenCallbackType = (translated: string) => void;

type PropsType = {
  id: string,
  as?: ?null,
  children?: ?ChildrenCallbackType,
};

const TranslateComponent = ({ id, children, ...props }: PropsType, { context }) => {
  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return translated;
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired,
};

export default TranslateComponent;
