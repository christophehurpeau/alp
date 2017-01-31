'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (asset, version) => asset.startsWith('/') ? `/${version}${asset}` : asset;
//# sourceMappingURL=assetUrl.js.map