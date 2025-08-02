import pobTypescriptReactConfig, {
  applyTs,
} from "@pob/eslint-config-typescript-react";

const configs = pobTypescriptReactConfig(import.meta.url).configs;

export default [
  ...configs.node,
  ...configs.allowUnsafeAsWarn,
  ...applyTs({
    mode: "directory",
    files: ["packages/alp-hello-react-example/src"],
    configs: [...configs.app],
  }),
  {
    files: ["packages/alp-hello-react-example/src/**/*.{ts,tsx}"],
    settings: {
      node: { moduleDirectory: ["node_modules", "src"] },
    },
  },
  ...applyTs({
    mode: "directory",
    files: ["packages/react-*/src"],
    configs: configs.node,
  }),
];
