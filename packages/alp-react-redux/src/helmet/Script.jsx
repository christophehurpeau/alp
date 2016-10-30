import { PropTypes } from 'react';
import { Helmet } from 'fody';
import assetUrl from './assetUrl';

type PropsType = {
  src: string,
};

const Script = ({ src, ...props }: PropsType, { context }) => {
  const version: string = context.config.get('version');

  return <Helmet script={[{ rel: 'stylesheet', src: assetUrl(src, version), ...props }]} />;
};

Script.contextProps = {
  context: PropTypes.shape({ config: PropTypes.instanceOf(Map) }).isRequired,
};

export default Script;
