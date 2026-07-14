import type { ConfigValues, NodeConfig, PackageConfig } from "./types";
type ConfigRecord = Record<string, unknown>;
export interface ConfigOptions {
    argv?: string[];
    packageConfig?: PackageConfig;
    version?: string;
}
export declare class Config {
    packageConfig?: PackageConfig;
    private _record;
    private readonly _dirname;
    constructor(dirname: string, options?: ConfigOptions);
    loadSync(options?: ConfigOptions): Config & NodeConfig;
    get<Key extends keyof ConfigValues>(key: Key): ConfigValues[Key];
    existsConfigSync(name: string): boolean;
    loadConfigSync(name: string): Readonly<ConfigRecord>;
}
export {};
//# sourceMappingURL=config.d.ts.map