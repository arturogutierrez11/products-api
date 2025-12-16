import { OncityCategoryMatch } from 'src/core/entities/oncity/categories/OncityCategory';

export interface IMegatoneMatchCategoriesRepository {
  findAllCategoriesOfMegatone(offset: number, limit: number);
  countMegatoneCategories();
  findAllCategoriesMatch(limit: number, offset: number): Promise<OncityCategoryMatch[]>;
}
