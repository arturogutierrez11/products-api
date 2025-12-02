import { Categories } from 'src/core/entities/madredb/categories/Categories';

export interface ICategoriesMadreBDRepository {
  findAlCategoriesInProductsMadre(
    offset: number,
    limit: number,
  ): Promise<Categories>;
  countMadreCategories();
}
