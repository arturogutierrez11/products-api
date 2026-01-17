import { Injectable, BadRequestException } from '@nestjs/common';
import { MarketplaceHttpClient } from '../../../http/MarketplaceHttpClient';

import { IUpdateMegatoneProductsRepository } from '../../../../../../adapters/repositories/marketplace/megatone/products/update-price-stock/IUpdateMegatoneProductsRepository';
import { UpdateMegatoneProductsPayload } from 'src/core/entitis/marketplace-api/megatone/products/update-price-stock/UpdateMegatoneProductsPayload';
import { UpdateMegatoneProductsResponse } from 'src/core/entitis/marketplace-api/megatone/products/update-price-stock/UpdateMegatoneProductsResponse';

@Injectable()
export class UpdateMegatoneProductsRepository implements IUpdateMegatoneProductsRepository {
  constructor(private readonly httpClient: MarketplaceHttpClient) {}

  async update(payload: UpdateMegatoneProductsPayload): Promise<UpdateMegatoneProductsResponse> {
    if (!payload.items || payload.items.length === 0) {
      throw new BadRequestException('items is required');
    }

    return this.httpClient.post<UpdateMegatoneProductsResponse>('/megatone/products/update', payload);
  }
}
