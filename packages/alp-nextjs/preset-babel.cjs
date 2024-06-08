"use strict";

module.exports = (api) => {
  const isServer = api.caller((caller) => !!caller && caller.isServer);

  return {
    presets: ["next/babel"],
    plugins: [
      [
        "babel-preset-pob-env/pob-babel-replace-plugin.cjs",
        {
          target: isServer ? "node" : "browser",
          targetVersion: isServer ? "16" : undefined,
        },
      ],

      // discard unused imports (like production-only or node-only imports)
      "babel-plugin-discard-module-references",
    ],
  };
};
