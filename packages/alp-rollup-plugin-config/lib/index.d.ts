import { Plugin } from "rollup";

interface TargetOptions {
  src: string;
  dest?: string;
}

interface PluginOptions {
  targets: TargetOptions[];
}

declare function alpRollupPluginConfig(options: PluginOptions): Plugin;

export = alpRollupPluginConfig;
