'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let MigrationsManager = class {
  constructor(store) {
    this.store = store;
  }

  findLastVersion() {
    if (this.store.r) {
      return this.store.findOne(this.store.table().orderBy(this.store.r.desc('version')).getField('version'));
    } else {
      return this.store.findOne({}, { created: -1 }).then(row => row && row.version);
    }
  }

  addMigrationDone(migration) {
    return this.store.insertOne(migration);
  }
};
exports.default = MigrationsManager;
//# sourceMappingURL=Manager.js.map