import { ProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/ProductSyncRepository';
import { SendBulkProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/SendBulkProductSyncRepository';
import { GetMegatoneProductsRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/get/GetMegatoneProductsRepository';
import { mapMegatoneStatus } from './mapper/MegatoneStatusMapper';
import { BulkMarketplaceProductsDto } from 'src/core/entitis/madre-api/product-sync/dto/BulkMarketplaceProductsDto';

export class SyncMegatoneProductsInteractor {
  private readonly BATCH_LIMIT = 50;

  constructor(
    private readonly getMegatoneProducts: GetMegatoneProductsRepository,
    private readonly sendBulkProductSync: SendBulkProductSyncRepository,
    private readonly syncRuns: ProductSyncRepository
  ) {}

  async execute(): Promise<void> {
    const { runId } = await this.syncRuns.start('megatone');

    let offset = 0;
    let hasNext = true;
    let failedItems = 0;

    try {
      while (hasNext) {
        const response = await this.getMegatoneProducts.execute(this.BATCH_LIMIT, offset);

        if (!response.items || response.items.length === 0) break;

        const payload: BulkMarketplaceProductsDto = {
          marketplace: 'megatone',
          items: response.items.map(item => ({
            externalId: String(item.publicationId),
            sellerSku: item.sellerSku,
            marketplaceSku: item.marketSku ?? null,
            price: item.price,
            stock: item.stock,
            status: mapMegatoneStatus(item.status),
            raw: item
          }))
        };

        await this.sendBulkProductSync.execute(payload);

        await this.syncRuns.progress(runId, {
          batches: 1,
          items: payload.items.length
        });

        hasNext = response.hasNext;
        offset = response.nextOffset ?? 0;
      }

      await this.syncRuns.finish(runId, 'SUCCESS');
    } catch (err: any) {
      await this.syncRuns.fail(runId, err.message ?? 'Unknown error');
      throw err;
    }
  }
}
