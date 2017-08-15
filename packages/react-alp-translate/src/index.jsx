import PropTypes from 'prop-types';

type ChildrenCallbackType = (translated: string) => void;

type PropsType = {|
  id: string,
  as: ?string,
  children: ?ChildrenCallbackType,
  [string]: any,
|};

const TranslateComponent = (
  { id, as: AsType = 'span', children, ...props }: PropsType,
  { context },
) => {
  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return (
    <AsType>
      {translated}
    </AsType>
  );
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired,
};

export default TranslateComponent;
