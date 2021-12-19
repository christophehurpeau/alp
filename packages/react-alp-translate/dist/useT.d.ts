declare type Params = Record<string, any>;
declare module 'alp-types' {
    interface Context {
        t: (id: string, params?: Params) => string;
    }
}
declare function useT(id: string): string;
declare function useT(id: string, params: Params, deps: readonly any[]): string;
export default useT;
//# sourceMappingURL=useT.d.ts.map