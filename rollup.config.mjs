import configs2 from "./packages/alp-node/rollup.config.mjs";
import configs3 from "./packages/react-alp-connection-state/rollup.config.mjs";
import configs4 from "./packages/react-alp-loading-bar/rollup.config.mjs";
import configs5 from "./packages/alp-body-parser/rollup.config.mjs";
import configs6 from "./packages/alp-migrations/rollup.config.mjs";
import configs7 from "./packages/alp-node-auth/rollup.config.mjs";

export default [
  ...configs2,
  ...configs3,
  ...configs4,
  ...configs5,
  ...configs6,
  ...configs7,
];
