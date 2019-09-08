interface Params {
    [key: string]: any;
}
declare module 'alp-types' {
    interface Context {
        t: (id: string, params?: Params) => string;
    }
}
export default function useT(id: string, params?: Params, deps?: readonly any[]): string;
export {};
//# sourceMappingURL=useT.d.ts.map