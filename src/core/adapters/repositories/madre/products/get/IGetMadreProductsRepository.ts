import { MadreProductDto } from 'src/core/entitis/madre-api/products/get/dto/MadreProductDto';
import { MadreProductsPaginatedResponse } from 'src/core/entitis/madre-api/products/get/MadreProductsPaginatedResponse';

export interface IGetMadreProductsRepository {
  listAll(limit: number, offset: number): Promise<MadreProductsPaginatedResponse>;
  getBySku(sku: string): Promise<MadreProductDto | null>;
}
