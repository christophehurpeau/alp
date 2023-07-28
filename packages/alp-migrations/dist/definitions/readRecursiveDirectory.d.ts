/// <reference types="node" />
import type { Stats } from 'node:fs';
export interface CallbackParam {
    filename: string;
    basedir: string;
    path: string;
    stat: Stats;
}
export default function readRecursiveDirectory(directory: string, callback: (param: CallbackParam) => Promise<void> | void): Promise<void>;
//# sourceMappingURL=readRecursiveDirectory.d.ts.map