export interface IBrandsMadreRepository {
  findAllBrandsFromMadreDB(offset: number, limit: number): Promise<string[]>;
  countBrandsFromMadreDB(): Promise<number>;
}
