'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (asset, version) => asset.startsWith('/') ? `${asset}?${version}` : asset;
//# sourceMappingURL=assetUrl.js.map