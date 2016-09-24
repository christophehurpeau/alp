'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _liwi = require('liwi');

class MigrationsManager extends _liwi.AbstractManager {

  findLastVersion() {
    return this.store.findOne({}, { created: -1 }).then(row => row && row.version);
  }

  addMigrationDone(migration) {
    return this.store.insertOne(migration);
  }
}
exports.default = MigrationsManager;
//# sourceMappingURL=Manager.js.map