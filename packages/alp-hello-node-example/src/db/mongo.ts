import { config } from "alp-node";
import type { MongoBaseModel } from "liwi-mongo";
import { MongoConnection, MongoStore } from "liwi-mongo";

export const mongoConnection: MongoConnection = new MongoConnection(
  new Map(
    Object.entries(
      config.get<Record<"mongodb", Record<string, number | string>>>("db")
        .mongodb,
    ).map(([key, value]) => [key, value]),
  ),
);

export const createMongoStore = <Model extends MongoBaseModel>(
  collectionName: string,
): MongoStore<Model> => {
  return new MongoStore(mongoConnection, collectionName);
};
