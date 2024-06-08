import type { NodeApplication, NodeConfig, PackageConfig } from "./types";
export interface ConfigOptions {
    argv?: string[];
    packageConfig?: PackageConfig;
    version?: string;
}
export declare class Config {
    packageConfig?: PackageConfig;
    private _map;
    private readonly _dirname;
    constructor(dirname: string, options?: ConfigOptions);
    loadSync(options?: ConfigOptions): Config & NodeConfig;
    get<T>(key: string): T;
    existsConfigSync(name: string): boolean;
    loadConfigSync(name: string): ReadonlyMap<string, unknown>;
}
export default function getConfig(app: NodeApplication, config: Config & NodeConfig): Config & NodeConfig;
//# sourceMappingURL=config.d.ts.map