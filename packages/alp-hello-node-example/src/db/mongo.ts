import { config } from "alp-node";
import type { MongoBaseModel } from "liwi-mongo";
import { MongoStore, MongoConnection } from "liwi-mongo";

export const mongoConnection: MongoConnection = new MongoConnection(
  config
    .get<Map<"mongodb", Map<string, number | string>>>("db")
    .get("mongodb")!,
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
