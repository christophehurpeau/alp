import { Config } from 'alp-node-config';
import type { AlpNodeAppOptions } from './AlpNodeApp';
import { AlpNodeApp } from './AlpNodeApp';
export { default as fetch } from 'node-fetch';
export type { Context } from './AlpNodeApp';
export { Config } from 'alp-node-config';
export declare const appDirname: string;
export declare const packageDirname: string;
export declare const packageConfig: Record<string, unknown>;
export declare const config: Config & import("alp-types").NodeConfig;
export type AppOptions = Omit<AlpNodeAppOptions, 'appDirname' | 'packageDirname' | 'config'>;
export default class App extends AlpNodeApp {
    constructor(options?: AppOptions);
}
//# sourceMappingURL=index.d.ts.map