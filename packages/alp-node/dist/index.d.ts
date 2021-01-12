import { Config } from 'alp-node-config';
import { AlpNodeApp, AlpNodeAppOptions } from './AlpNodeApp';
export { Config };
export declare const appDirname: string;
export declare const packageDirname: string;
export declare const packageConfig: any;
export declare const config: Config & import("alp-types").NodeConfig;
export declare type AppOptions = Omit<AlpNodeAppOptions, 'appDirname' | 'packageDirname' | 'config'>;
export default class App extends AlpNodeApp {
    constructor(options: AppOptions);
}
//# sourceMappingURL=index.d.ts.map