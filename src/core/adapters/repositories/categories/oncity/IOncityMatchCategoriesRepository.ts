import { OncityCategoryMatch } from 'src/core/entities/oncity/categories/OncityCategory';

export interface IOncityMatchCategoriesRepository {
  findAllCategoriesMatch(limit: number, offset: number): Promise<OncityCategoryMatch[]>;
  countCategoriesMatch();
}
