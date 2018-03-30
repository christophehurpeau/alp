/* eslint-disable import/no-unresolved, import/no-commonjs */
const { MongoStore } = require('liwi-mongo');
const { RethinkStore } = require('liwi-rethinkdb');

export default async (rethinkConnection, mongoConnection) => {
  const rethinkUsersStore = new RethinkStore(rethinkConnection, 'users');
  const mongoUsersStore = new MongoStore(mongoConnection, 'users');

  const usersCursor = await rethinkUsersStore
    .query()
    .limit(99999)
    .run({ cursor: true });

  return usersCursor.eachAsync(async (row, rowFinished) => {
    row._id = row.id;
    delete row.id;
    await mongoUsersStore.insertOne(row);
    rowFinished();
  });
};
