import type { NodeApplication, NodeConfig } from 'alp-types';
import type MigrationsManager from './Manager';
export { default as MigrationsManager } from './Manager';
export interface Options {
    app: NodeApplication;
    migrationsManager: MigrationsManager;
    config?: NodeConfig;
    dirname?: string;
}
export default function migrate({ app, migrationsManager, config, dirname, }: Options): Promise<void>;
//# sourceMappingURL=index.d.ts.map