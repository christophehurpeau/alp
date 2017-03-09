export default (function (asset, version) {
  return asset.startsWith('/') ? `${asset}?${version}` : asset;
});
//# sourceMappingURL=assetUrl.js.map