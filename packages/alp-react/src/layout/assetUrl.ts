import 'pob-babel';

export type AssetUrl = (asset: string, version: string) => string;

const assetUrl: AssetUrl = !__DEV__
  ? (asset: string, version: string): string =>
      asset.startsWith('/') ? `/${version}${asset}` : asset
  : (asset: string, version: string): string =>
      asset.startsWith('/') ? `${asset}?${version}` : asset;

export default assetUrl;
