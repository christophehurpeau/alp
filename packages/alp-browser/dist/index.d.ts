import 'pob-babel';
import type { BrowserApplication as BrowserApplicationType, BrowserApplicationInCreation, BaseContext as AlpBaseContext, Context as AlpContext, Config, ContextState, RawConfig, ContextRequest } from 'alp-types';
import Ibex from 'ibex';
export declare type BrowserApplication = BrowserApplicationType;
declare global {
    interface Window {
        __VERSION__: string;
    }
}
interface Options {
    version?: string;
}
declare module 'ibex' {
    interface BaseContext extends AlpBaseContext {
    }
    interface BaseRequest extends ContextRequest {
    }
    interface DefaultState extends ContextState {
    }
    interface Context extends AlpContext {
    }
}
export default class AlpBrowser extends Ibex implements BrowserApplicationInCreation {
    path: string;
    appVersion: string;
    constructor(path?: string, { version }?: Options);
    config?: Config | undefined;
    init(): Promise<BrowserApplication>;
    existsConfig(name: string): Promise<boolean>;
    loadConfig(name: string): Promise<RawConfig>;
    start(fn: () => Promise<void>): void;
}
export declare const startApp: (callback: (app: BrowserApplication) => unknown) => void;
export {};
//# sourceMappingURL=index.d.ts.map