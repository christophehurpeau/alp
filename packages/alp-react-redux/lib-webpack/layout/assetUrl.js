export default (function (asset, version) {
  return asset.startsWith('/') ? '/' + version + asset : asset;
});
//# sourceMappingURL=assetUrl.js.map