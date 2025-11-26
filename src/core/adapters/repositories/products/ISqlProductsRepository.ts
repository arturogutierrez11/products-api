export interface ISqlProductsRepository {
  findManyByIds(ids: number[]);
  findAllProducts(limit: number, offset: number);
  countAllProducts();
  findPaginated(limit: number, offset: number);
}
