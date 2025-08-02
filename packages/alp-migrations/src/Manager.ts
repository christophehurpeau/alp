import type { MongoBaseModel, MongoInsertType, MongoStore } from "liwi-mongo";

export interface Migration extends MongoBaseModel {
  version: string;
  fileName: string;
}

export default class MigrationsManager {
  store: MongoStore<Migration>;

  constructor(store: MongoStore<Migration>) {
    this.store = store;
  }

  findLastVersion(): Promise<string | undefined> {
    return this.store.findOne({}, { created: -1 }).then((row) => row?.version);
  }

  addMigrationDone(migration: MongoInsertType<Migration>): Promise<Migration> {
    return this.store.insertOne(migration);
  }
}
