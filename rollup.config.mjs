import configs1 from "./packages/alp-nextjs/rollup.config.mjs";
import configs2 from "./packages/alp-node/rollup.config.mjs";
import configs3 from "./packages/react-alp-connection-state/rollup.config.mjs";
import configs4 from "./packages/react-alp-loading-bar/rollup.config.mjs";
import configs5 from "./packages/alp-body-parser/rollup.config.mjs";
import configs6 from "./packages/alp-migrations/rollup.config.mjs";
import configs7 from "./packages/alp-node-auth/rollup.config.mjs";
import configs8 from "./packages/react-alp-auth/rollup.config.mjs";
import configs9 from "./packages/alp-hello-node-example/rollup.config.mjs";

export default [
  ...configs1,
  ...configs2,
  ...configs3,
  ...configs4,
  ...configs5,
  ...configs6,
  ...configs7,
  ...configs8,
  ...configs9,
];
