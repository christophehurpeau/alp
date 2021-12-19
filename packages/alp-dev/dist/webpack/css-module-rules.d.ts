import type { RuleSetUseItem, RuleSetRule } from 'webpack';
declare type Target = 'node' | 'modern-browser' | 'browser';
export interface CreateCssModuleUseOptions {
    target: Target;
    extractLoader: RuleSetUseItem;
    global?: boolean;
    plugins: any[];
    production: boolean;
    otherLoaders?: RuleSetUseItem[];
}
export interface CreateScssModuleUseOptions {
    target: Target;
    extractLoader: RuleSetUseItem;
    global?: boolean;
    plugins: any[];
    production: boolean;
    themeFile?: string;
    otherLoaders?: RuleSetUseItem[];
    includePaths?: string[];
}
export interface CreateModuleRulesOptions {
    target: Target;
    extractLoader: RuleSetUseItem;
    plugins: any[];
    production: boolean;
    themeFile?: string;
    includePaths?: string[];
}
export interface StylesCacheGroups {
    name: 'styles';
    test: RegExp;
    chunks: 'all';
    enforce: true;
}
declare type CreateCssModuleUseFn = (options: CreateCssModuleUseOptions) => RuleSetUseItem[];
declare type CreateModuleRulesFn = (options: CreateModuleRulesOptions) => RuleSetRule[];
export declare const createCssModuleUse: CreateCssModuleUseFn;
export declare const stylesCacheGroups: {
    name: string;
    test: RegExp;
    chunks: string;
    enforce: boolean;
};
export declare const createModuleRules: CreateModuleRulesFn;
export {};
//# sourceMappingURL=css-module-rules.d.ts.map