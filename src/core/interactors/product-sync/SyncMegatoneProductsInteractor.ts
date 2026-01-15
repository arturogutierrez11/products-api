import { Injectable } from '@nestjs/common';
import { ProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/ProductSyncRepository';
import { SendBulkProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/SendBulkProductSyncRepository';
import { GetMegatoneProductsRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/get/GetMegatoneProductsRepository';
import { mapMegatoneStatus } from './mapper/MegatoneStatusMapper';
import { BulkMarketplaceProductsDto } from 'src/core/entitis/madre-api/product-sync/dto/BulkMarketplaceProductsDto';

@Injectable()
export class SyncMegatoneProductsInteractor {
  private readonly BATCH_LIMIT = 50;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 1000;

  constructor(
    private readonly getMegatoneProducts: GetMegatoneProductsRepository,
    private readonly sendBulkProductSync: SendBulkProductSyncRepository,
    private readonly syncRuns: ProductSyncRepository
  ) {}

  async execute(): Promise<void> {
    const { runId } = await this.syncRuns.start('megatone');

    let offset = 0;
    let hasNext = true;

    let totalBatches = 0;
    let totalItems = 0;
    let failedItems = 0;

    try {
      while (hasNext) {
        const response = await this.getMegatoneProducts.execute(this.BATCH_LIMIT, offset);

        if (!response.items || response.items.length === 0) {
          break;
        }

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

        const success = await this.sendWithRetry(payload);

        await this.syncRuns.progress(runId, {
          batches: 1,
          items: payload.items.length,
          failed: success ? 0 : payload.items.length
        });

        if (!response.hasNext) {
          break;
        }

        offset = response.nextOffset!;
      }
      const finalStatus = failedItems > 0 ? 'PARTIAL' : 'SUCCESS';
      await this.syncRuns.finish(runId, finalStatus);
    } catch (err: any) {
      await this.syncRuns.fail(runId, err.message ?? 'Unknown error');
      throw err;
    }
  }

  /* =====================================================
     RETRY
  ===================================================== */
  private async sendWithRetry(payload: BulkMarketplaceProductsDto): Promise<boolean> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        await this.sendBulkProductSync.execute(payload);
        return true;
      } catch {
        if (attempt < this.MAX_RETRIES) {
          await this.sleep(this.RETRY_DELAY_MS);
        }
      }
    }

    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
