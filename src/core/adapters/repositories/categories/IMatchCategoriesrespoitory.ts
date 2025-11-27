export interface IMatchCategoriesrespoitory {
  write(rows: any[]): Promise<void>;
  clear(): Promise<void>;
  readAll(): Promise<any[]>;
  updateRows(rows: { productId: number; data: any }[]): Promise<void>;
}
