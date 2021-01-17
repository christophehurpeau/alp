import type { BrowserApplicationInCreation, Config } from 'alp-types';
declare type RawConfig = Map<string, unknown>;
export declare function getConfig(path: string): Promise<RawConfig>;
export declare function existsConfig(path: string): Promise<boolean> | boolean;
export default function alpConfig(app: BrowserApplicationInCreation, configPath: string): Promise<Config>;
export {};
//# sourceMappingURL=index.d.ts.map