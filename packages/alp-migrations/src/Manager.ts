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

  constructor(store: MongoStore<Migration>) {
    this.store = store;
  }

  findLastVersion() {
    return this.store.findOne({}, { created: -1 }).then((row) => row?.version);
  }

  addMigrationDone(migration: MongoInsertType<Migration>) {
    return this.store.insertOne(migration);
  }
}
