import type { PobpackCompiler } from 'pobpack-types';
import type { Watching } from 'webpack';
export declare const createNodeCompiler: (production: boolean) => PobpackCompiler;
export declare const watchAndRun: (nodeCompiler: PobpackCompiler, port: string | number) => Watching;
//# sourceMappingURL=node.d.ts.map