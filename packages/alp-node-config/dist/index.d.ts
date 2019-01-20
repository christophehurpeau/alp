import { NodeApplication, NodeConfig, PackageConfig } from 'alp-types';
export interface ConfigOptions {
    argv?: Array<string>;
    packageConfig?: PackageConfig;
    version?: string;
}
export declare class Config {
    packageConfig?: PackageConfig;
    private _map;
    private _dirname;
    constructor(dirname: string, options?: ConfigOptions);
    loadSync(options?: ConfigOptions): Config & NodeConfig;
    get(key: string): any;
    existsConfigSync(name: string): boolean;
    loadConfigSync(name: string): Map<string, any>;
}
declare const _default: (app: NodeApplication, config: Config & NodeConfig) => Config & NodeConfig;
export default _default;
//# sourceMappingURL=index.d.ts.map