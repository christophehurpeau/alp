import { MongoUsersManager } from 'alp-node-auth';
import type { User as BasicUser } from 'alp-node-auth/types.d';
import { createMongoStore } from './mongo';

export type User = BasicUser;

export const usersMongoStore = createMongoStore<User>('users');

export const usersManager =
  new (class CustomUsersManager extends MongoUsersManager<User> {
    constructor() {
      super(usersMongoStore);
    }
  })();
