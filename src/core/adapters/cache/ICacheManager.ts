export interface ICacheManager {
  get(key: string): Promise<any>;

  save(key: string, data: any): Promise<void>;
}
