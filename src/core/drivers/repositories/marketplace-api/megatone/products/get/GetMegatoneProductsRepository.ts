import { MegatoneProductsPaginatedResponse } from 'src/core/entitis/marketplace-api/megatone/products/get/MegatoneProductsPaginatedResponse';
import { MarketplaceHttpClient } from '../../../http/MarketplaceHttpClient';

export class GetMegatoneProductsRepository {
  constructor(private readonly httpClient: MarketplaceHttpClient) {}

  async execute(limit: number, offset: number): Promise<MegatoneProductsPaginatedResponse> {
    return this.httpClient.get<MegatoneProductsPaginatedResponse>('/megatone/products', {
      limit,
      offset
    });
  }
}
