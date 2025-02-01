import type { MongoBaseModel, MongoInsertType, MongoStore } from "liwi-mongo";
export interface Migration extends MongoBaseModel {
    version: string;
    fileName: string;
}
export default class MigrationsManager {
    store: MongoStore<Migration>;
    constructor(store: MongoStore<Migration>);
    findLastVersion(): Promise<string | undefined>;
    addMigrationDone(migration: MongoInsertType<Migration>): Promise<Migration>;
}
//# sourceMappingURL=Manager.d.ts.map