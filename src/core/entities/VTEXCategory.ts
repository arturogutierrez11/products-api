export interface VTEXCategoryTree {
  id: number;
  name: string;
  hasChildren?: boolean;
  children?: VTEXCategoryTree[];
}
