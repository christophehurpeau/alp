import { MongoStore, MongoInsertType } from 'liwi-mongo';
export interface Migration {
    _id: string;
    version: string;
    fileName: string;
    created: Date;
    updated: Date;
}
export default class MigrationsManager {
    store: MongoStore<Migration>;
    constructor(store: MongoStore<Migration>);
    findLastVersion(): Promise<string | undefined>;
    addMigrationDone(migration: MongoInsertType<Migration>): Promise<Migration>;
}
//# sourceMappingURL=Manager.d.ts.map