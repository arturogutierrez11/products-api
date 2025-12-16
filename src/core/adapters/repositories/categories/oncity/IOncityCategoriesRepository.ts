import { OncityCategory } from 'src/core/entities/oncity/categories/OncityCategory';

export interface IOncityCategoriesRepository {
  getTree(): Promise<OncityCategory[]>;
}
