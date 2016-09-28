import MongoStore from 'liwi/mongo';
import { AbstractManager } from 'liwi';

export default class MigrationsManager extends AbstractManager {
  store: MongoStore;

  findLastVersion() {
    if (this.store.r) {
      return this.store.findOne(
        this.store.table().getField('version'),
      );
    } else {
      return this.store.findOne({}, { created: -1 })
        .then(row => row && row.version);
    }
  }

  addMigrationDone(migration) {
    return this.store.insertOne(migration);
  }
}
