'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function assetUrl(asset, version) {
  return asset.startsWith('/') ? `/${ version }${ asset }` : asset;
};
//# sourceMappingURL=assetUrl.js.map