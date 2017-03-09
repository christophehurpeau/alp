import assetUrl from './assetUrl';

type PropsType = {
  href: string,
};

type ContextType = {
  context: {
    config: Map<string, any>,
  },
};

export default ({ href, ...props }: PropsType, { context }: ContextType) => {
  const version: string = context.config.get('version');

  return <link rel="stylesheet" href={assetUrl(href, version)} {...props} />;
};
