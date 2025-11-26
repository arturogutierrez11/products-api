// import { ICacheManager } from '../../adapters/cache/ICacheManager';
//
// export class InMemoryCacheManager implements ICacheManager {
//   private database: { [key: string]: any } = {};
//   get(key: string): Promise<any> {
//     return Promise.resolve(this.database[key]);
//   }
//   save(key: string, data: any): Promise<void> {
//     this.database[key] = data;
//     return Promise.resolve();
//   }
// }
