'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function assetUrl(asset, version) {
  return asset.startsWith('/') ? `${ asset }?${ version }` : asset;
};
//# sourceMappingURL=assetUrl.js.map