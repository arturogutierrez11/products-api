import { Injectable, BadRequestException } from '@nestjs/common';
import { MarketplaceHttpClient } from '../../../http/MarketplaceHttpClient';

import { IUpdateMegatoneProductStatusRepository } from 'src/core/adapters/repositories/marketplace/megatone/products/update-status/IUpdateMegatoneProductStatusRepository';
import { UpdateMegatoneProductStatusPayload } from 'src/core/entitis/marketplace-api/megatone/products/update-status/UpdateMegatoneProductStatusPayload';
import { MarketplaceBulkUpdateResult } from 'src/core/entitis/marketplace-api/megatone/products/update-status/MarketplaceBulkUpdateResult';

@Injectable()
export class UpdateMegatoneProductStatusRepository implements IUpdateMegatoneProductStatusRepository {
  constructor(private readonly httpClient: MarketplaceHttpClient) {}

  async bulkUpdateStatus(
    items: UpdateMegatoneProductStatusPayload['items'],
    userId: number
  ): Promise<MarketplaceBulkUpdateResult> {
    if (!items || items.length === 0) {
      throw new BadRequestException('items is required');
    }

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    return this.httpClient.put<MarketplaceBulkUpdateResult>('/megatone/products/status', {
      items,
      userId
    });
  }
}
