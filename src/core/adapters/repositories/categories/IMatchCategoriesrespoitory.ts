export interface IMatchCategoriesrespoitory {
  write(rows: any[]): Promise<void>;
  clear(): Promise<void>;
}
