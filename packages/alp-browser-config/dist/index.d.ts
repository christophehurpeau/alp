import { BrowserApplicationInCreation } from 'alp-types';
declare type RawConfig = Map<string, any>;
export declare function getConfig(path: string): Promise<RawConfig>;
export declare function existsConfig(path: string): Promise<boolean> | boolean;
export default function alpConfig(app: BrowserApplicationInCreation, configPath: string): Promise<any>;
export {};
//# sourceMappingURL=index.d.ts.map