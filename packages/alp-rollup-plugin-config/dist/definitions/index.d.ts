import type { Plugin } from "rollup";
interface TargetOptions {
    src: string;
    dest?: string;
}
interface PluginOptions {
    targets: TargetOptions[];
}
export default function alpRollupPluginConfig(options: PluginOptions): Plugin;
export {};
//# sourceMappingURL=index.d.ts.map