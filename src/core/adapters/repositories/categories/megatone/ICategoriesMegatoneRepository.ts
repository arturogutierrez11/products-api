export interface ICategoriesMegatoneRepository {
  findAllCategoriesOfMegatone(offset: number, limit: number);
  countMegatoneCategories();
}
