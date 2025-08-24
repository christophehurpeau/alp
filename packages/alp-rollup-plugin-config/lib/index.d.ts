import { Plugin } from "rollup";

interface TargetOptions {
  src: string;
  dest?: string;
  rename?: (name: string, extension: string) => string;
  transform?: (contents: string, srcPath: string, destPath: string) => string;
}

interface PluginOptions {
  targets: TargetOptions[];
  [key: string]: any;
}

declare function alpRollupPluginConfig(options: PluginOptions): Plugin;

export = alpRollupPluginConfig;
