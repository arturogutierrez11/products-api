export interface ICategoriesSheetRepository {
  write(rows: any[]): Promise<void>;
  clear(): Promise<void>;
}
