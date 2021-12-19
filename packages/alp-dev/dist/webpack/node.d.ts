import type { Watching } from 'webpack';
import type { PobpackCompiler } from '../pobpack/types';
export declare const createNodeCompiler: (production: boolean) => PobpackCompiler;
export declare const watchAndRun: (nodeCompiler: PobpackCompiler, port: string | number) => Pick<Watching, 'close' | 'invalidate'>;
//# sourceMappingURL=node.d.ts.map