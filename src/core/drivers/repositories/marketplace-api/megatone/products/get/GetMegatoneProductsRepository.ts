import { MegatoneProductsPaginatedResponse } from 'src/core/entitis/marketplace-api/megatone/products/get/MegatoneProductsPaginatedResponse';
import { MarketplaceHttpClient } from '../../../http/MarketplaceHttpClient';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetMegatoneProductsRepository {
  constructor(private readonly httpClient: MarketplaceHttpClient) {}

  async execute(limit: number, offset: number): Promise<MegatoneProductsPaginatedResponse> {
    return this.httpClient.get<MegatoneProductsPaginatedResponse>('/megatone/products', {
      limit,
      offset
    });
  }
}
