export type NormalizedCategory = {
  id: string | number;
  name: string;
  fullPath: string;
};
export interface ICategorySourceAdapter {
  getCategories(): Promise<NormalizedCategory[]>;
  getSheetName(): string;
}
