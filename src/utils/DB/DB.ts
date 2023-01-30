import DBMemberTypes from './entities/DBMemberTypes';
import DBPosts from './entities/DBPosts';
import DBProfiles from './entities/DBProfiles';
import DBUsers from './entities/DBUsers';
import * as lodash from 'lodash';

export default class DB {
  users = new DBUsers();
  profiles = new DBProfiles();
  memberTypes = new DBMemberTypes();
  posts = new DBPosts();

  constructor() {
    const deepCopyResultTrap: ProxyHandler<any> = {
      get: (target, prop) => {
        if (typeof target[prop] === 'function') {
          return (...args: any[]) => {
            const result = target[prop](...args);
            if (result instanceof Promise) {
              return result.then((v) => lodash.cloneDeep(v));
            }
            return lodash.cloneDeep(result);
          };
        } else {
          return target[prop];
        }
      },
    };
    for (const [k, v] of Object.entries(this)) {
      this[k as keyof typeof this] = new Proxy(v, deepCopyResultTrap);
    }
  }
}
