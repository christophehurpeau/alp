import assetUrl from './assetUrl';

type PropsType = {
  src: string,
};

type ContextType = {
  context: {
    config: Map<string, any>,
  },
};

export default ({ src, ...props }: PropsType, { context }: ContextType) => {
  const version: string = context.config.get('version');

  return <script src={assetUrl(src, version)} {...props} />;
};
