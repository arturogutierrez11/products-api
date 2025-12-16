export interface IBrandsMegatoneRepository {
  findAllBrandsOfMegatone(offset: number, limit: number);
  countMegatoneBrands();
}
