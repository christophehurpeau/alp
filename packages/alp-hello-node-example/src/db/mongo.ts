// eslint-disable-next-line import-x/no-unresolved
import { config } from "alp-node";
import type { MongoBaseModel, MongoConfig } from "liwi-mongo";
// eslint-disable-next-line import-x/no-unresolved
import { MongoConnection, MongoStore } from "liwi-mongo";

export const mongoConnection: MongoConnection = new MongoConnection(
  config.get<Record<"mongodb", MongoConfig>>("db").mongodb,
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
