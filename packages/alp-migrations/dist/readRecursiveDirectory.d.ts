/// <reference types="node" />
import type { Stats } from 'fs';
export interface CallbackParam {
    filename: string;
    basedir: string;
    path: string;
    stat: Stats;
}
export default function readRecursiveDirectory(directory: string, callback: (param: CallbackParam) => void | Promise<void>): Promise<void>;
//# sourceMappingURL=readRecursiveDirectory.d.ts.map