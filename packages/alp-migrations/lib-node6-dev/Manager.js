'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongo = require('liwi/mongo');

var _mongo2 = _interopRequireDefault(_mongo);

var _liwi = require('liwi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MigrationsManager extends _liwi.AbstractManager {

    findLastVersion() {
        return this.store.findOne({}, { created: -1 }).then(row => {
            return row && row.version;
        });
    }

    addMigrationDone(migration) {
        return this.store.insertOne(migration);
    }
}
exports.default = MigrationsManager;
//# sourceMappingURL=Manager.js.map