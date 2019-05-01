import { NodeApplication, NodeConfig, PackageConfig } from 'alp-types';
export interface ConfigOptions {
    argv?: string[];
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
export default function getConfig(app: NodeApplication, config: Config & NodeConfig): Config & NodeConfig;
//# sourceMappingURL=index.d.ts.map