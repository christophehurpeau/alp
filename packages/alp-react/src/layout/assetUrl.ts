import { IS_DEV } from 'pob-babel';

export type AssetUrl = (asset: string, version: string) => string;

const assetUrl: AssetUrl = !IS_DEV
  ? (asset: string, version: string): string =>
      asset.startsWith('/') ? `/${version}${asset}` : asset
  : (asset: string, version: string): string =>
      asset.startsWith('/') ? `${asset}?${version}` : asset;

export default assetUrl;
