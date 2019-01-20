import { PRODUCTION } from 'pob-babel';

export type AssetUrl = (asset: string, version: string) => string;

const assetUrl: AssetUrl = PRODUCTION
  ? (asset: string, version: string) =>
      asset.startsWith('/') ? `/${version}${asset}` : asset
  : (asset: string, version: string) =>
      asset.startsWith('/') ? `${asset}?${version}` : asset;

export default assetUrl;
