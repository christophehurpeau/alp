'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _liwi = require('liwi');

class MigrationsManager extends _liwi.AbstractManager {

  findLastVersion() {
    if (this.store.r) {
      return this.store.findOne(this.store.table().getField('version'));
    } else {
      return this.store.findOne({}, { created: -1 }).then(row => row && row.version);
    }
  }

  addMigrationDone(migration) {
    return this.store.insertOne(migration);
  }
}
exports.default = MigrationsManager;
//# sourceMappingURL=Manager.js.map