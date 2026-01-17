import { MegatoneProductsPaginatedResponse } from 'src/core/entitis/marketplace-api/megatone/products/get/MegatoneProductsPaginatedResponse';
import { MarketplaceHttpClient } from '../../../http/MarketplaceHttpClient';
import { Injectable } from '@nestjs/common';
import { IGetMegatoneProductsRepository } from 'src/core/adapters/repositories/marketplace/megatone/products/get/IGetMegatoneProductsRepository';
@Injectable()
export class GetMegatoneProductsRepository implements IGetMegatoneProductsRepository {
  constructor(private readonly httpClient: MarketplaceHttpClient) {}

  async execute(limit: number, offset: number): Promise<MegatoneProductsPaginatedResponse> {
    return this.httpClient.get<MegatoneProductsPaginatedResponse>('/megatone/products', {
      limit,
      offset
    });
  }
}
