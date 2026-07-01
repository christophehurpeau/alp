import pobTypescriptReactConfig, {
  applyTs,
} from "@pob/eslint-config-typescript-react";
import checkPackage from "check-package-dependencies/eslint-plugin";

const configs = pobTypescriptReactConfig(import.meta.url).configs;

export default [
  checkPackage.configs["recommended-library"],
  ...configs.node,
  ...configs.allowUnsafeAsWarn,
  ...applyTs({
    mode: "directory",
    files: ["packages/react-*/src"],
    configs: configs.node,
  }),
];
