import { PropTypes } from 'react';
import { Helmet } from 'fody/src';
import assetUrl from './assetUrl';

const Stylesheet = ({ href, ...props }, { context }) => {
  const version: string = context.config.get('version');

  return <Helmet link={[{ rel: 'stylesheet', href: assetUrl(href, version), ...props }]} />;
};

Stylesheet.propTypes = {
  href: PropTypes.string.isRequired,
};

Stylesheet.contextProps = {
  context: PropTypes.shape({ config: PropTypes.instanceOf(Map) }).isRequired,
};

export default Stylesheet;
