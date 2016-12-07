export default (function assetUrl(asset, version) {
  return asset.startsWith('/') ? `${ asset }?${ version }` : asset;
});
//# sourceMappingURL=assetUrl.js.map