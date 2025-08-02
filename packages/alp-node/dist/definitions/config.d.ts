import type { NodeConfig, PackageConfig } from "./types";
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
    get<T>(key: string): Readonly<T>;
    existsConfigSync(name: string): boolean;
    loadConfigSync(name: string): Readonly<Record<string, unknown>>;
}
//# sourceMappingURL=config.d.ts.map