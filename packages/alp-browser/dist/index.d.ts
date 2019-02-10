import Ibex from 'ibex';
import { BrowserApplication as BrowserApplicationType, BrowserApplicationInCreation } from 'alp-types';
export declare type BrowserApplication = BrowserApplicationType;
declare global {
    interface Window {
        __VERSION__: string;
    }
}
interface Options {
    version?: string;
}
export default class AlpBrowser extends Ibex implements BrowserApplicationInCreation {
    path: string;
    appVersion: string;
    constructor(path?: string, { version }?: Options);
    init(): Promise<BrowserApplication>;
    existsConfig(name: string): boolean | Promise<boolean>;
    loadConfig(name: string): Promise<Map<string, any>>;
    start(fn: Function): void;
}
export {};
//# sourceMappingURL=index.d.ts.map