import { BulkMarketplaceProductsDto } from 'src/core/entitis/madre-api/product-sync/dto/BulkMarketplaceProductsDto';

export interface ISendBulkProductSyncRepository {
  execute(payload: BulkMarketplaceProductsDto): Promise<void>;
}
