import { Config } from 'alp-node-config';
import type { AlpNodeAppOptions, Context } from './AlpNodeApp';
import { AlpNodeApp } from './AlpNodeApp';
export type { Context };
export { Config };
export declare const appDirname: string;
export declare const packageDirname: string;
export declare const packageConfig: Record<string, unknown>;
export declare const config: Config & import("alp-types").NodeConfig;
export declare type AppOptions = Omit<AlpNodeAppOptions, 'appDirname' | 'packageDirname' | 'config'>;
export default class App extends AlpNodeApp {
    constructor(options?: AppOptions);
}
//# sourceMappingURL=index.d.ts.map