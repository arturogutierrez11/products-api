import { MarketplaceBulkUpdateResult } from 'src/core/entitis/marketplace-api/megatone/products/update-status/MarketplaceBulkUpdateResult';

export interface IUpdateMegatoneProductStatusRepository {
  bulkUpdateStatus(
    items: {
      publicationId: number;
      status: number;
    }[],
    userId: number
  ): Promise<MarketplaceBulkUpdateResult>;
}
