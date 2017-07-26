export default (PRODUCTION
  ? (asset, version) => (asset.startsWith('/') ? `/${version}${asset}` : asset)
  : (asset, version) => (asset.startsWith('/') ? `${asset}?${version}` : asset));
