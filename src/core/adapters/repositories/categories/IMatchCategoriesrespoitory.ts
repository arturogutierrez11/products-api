export interface IMatchCategoriesRepository {
  write(rows: any[]): Promise<void>;
  clear(): Promise<void>;
  readAll(): Promise<any[]>;
  applyResults(rows: any[]): Promise<void>;
}
