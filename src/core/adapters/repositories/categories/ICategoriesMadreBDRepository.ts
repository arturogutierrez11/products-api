import { Categories } from 'src/core/entities/Categories';

export interface ICategoriesMadreBDRepository {
  findAlCategoriesInProductsMadre(
    offset: number,
    limit: number,
  ): Promise<Categories>;
  countCategories();
}
