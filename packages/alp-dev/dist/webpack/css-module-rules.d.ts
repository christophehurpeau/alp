import type { RuleSetUseItem, RuleSetRule } from 'webpack';
declare type Target = 'node' | 'modern-browser' | 'browser';
export interface CreateCssUseOptions {
    target: Target;
    extractLoader: RuleSetUseItem;
    plugins: any[];
    production: boolean;
    otherLoaders?: RuleSetUseItem[];
}
export interface CreateModuleRulesOptions {
    target: Target;
    extractLoader: RuleSetUseItem;
    plugins: any[];
    production: boolean;
}
export interface StylesCacheGroups {
    name: 'styles';
    test: RegExp;
    chunks: 'all';
    enforce: true;
}
declare type CreateCssModuleUseFn = (options: CreateCssUseOptions) => RuleSetUseItem[];
export declare const createCssUse: CreateCssModuleUseFn;
export declare const createCssRule: (options: CreateCssUseOptions) => RuleSetRule;
export declare const stylesCacheGroups: {
    name: string;
    test: RegExp;
    chunks: string;
    enforce: boolean;
};
export {};
//# sourceMappingURL=css-module-rules.d.ts.map