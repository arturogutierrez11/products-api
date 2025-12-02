export interface IMatchCategoriesRepository {
  readAll(sheetName: string): Promise<any[]>;
  write(sheetName: string, rows: any[]): Promise<void>;
  applyResults?(sheetName: string, rows: any[]): Promise<void>; // ← OPCIONAL
  clear?(sheetName: string): Promise<void>; // ← OPCIONAL
}
