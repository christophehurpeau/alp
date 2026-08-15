import pobTypescriptReactConfig, {
  applyTs,
} from "@pob/eslint-config-typescript-react";

const configs = pobTypescriptReactConfig.configs;

export default [
  ...configs.node,
  ...configs.allowUnsafeAsWarn,
  ...applyTs({
    mode: "directory",
    files: ["packages/react-*/src"],
    configs: configs.node,
  }),
];
