import type AlpNodeApp from "alp-node";
import type MigrationsManager from "./Manager";
export { default as MigrationsManager } from "./Manager";
export interface Options {
    app: AlpNodeApp;
    migrationsManager: MigrationsManager;
    config?: AlpNodeApp["config"];
    dirname?: string;
}
export default function migrate({ app, migrationsManager, config, dirname, }: Options): Promise<void>;
//# sourceMappingURL=index.d.ts.map