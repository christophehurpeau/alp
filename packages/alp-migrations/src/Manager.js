export default class MigrationsManager {
  constructor(store) {
    this.store = store;
  }

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
