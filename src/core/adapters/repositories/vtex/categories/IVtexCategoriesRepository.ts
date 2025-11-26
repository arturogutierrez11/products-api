import { VTEXCategoryTree } from 'src/core/entities/VTEXCategory';

export interface IVtexCategoriesRepository {
  getTree(): Promise<VTEXCategoryTree[]>;
}
