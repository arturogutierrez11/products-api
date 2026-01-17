import { MegatoneProductsPaginatedResponse } from 'src/core/entitis/marketplace-api/megatone/products/get/MegatoneProductsPaginatedResponse';

export interface IGetMegatoneProductsRepository {
  execute(limit: number, offset: number): Promise<MegatoneProductsPaginatedResponse>;
}
