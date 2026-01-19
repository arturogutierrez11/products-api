import { Inject, Injectable } from '@nestjs/common';
import { IGetProductSyncItemsRepository } from 'src/core/adapters/repositories/madre/product-sync/IGetProductSyncItemsRepository';
import { IUpdateProductSyncItemRepository } from 'src/core/adapters/repositories/madre/product-sync/IUpdateProductSyncItemRepository';
import { IUpdateMegatoneProductStatusRepository } from 'src/core/adapters/repositories/marketplace/megatone/products/update-status/IUpdateMegatoneProductStatusRepository';

type UpdateMode = 'ACTIVATE' | 'PAUSE';

@Injectable()
export class UpdateStatus {
  private readonly LIMIT = 100;
  private readonly USER_ID = 389;

  constructor(
    @Inject('IGetProductSyncItemsRepository')
    private readonly getSyncItems: IGetProductSyncItemsRepository,

    @Inject('IUpdateProductSyncItemRepository')
    private readonly updateSyncItem: IUpdateProductSyncItemRepository,

    @Inject('IUpdateMegatoneProductStatusRepository')
    private readonly updateMegatoneStatus: IUpdateMegatoneProductStatusRepository
  ) {}

  async execute(mode: UpdateMode): Promise<{
    processed: number;
    updated: number;
    failed: number;
  }> {
    let offset = 0;
    let processed = 0;
    let updated = 0;
    let failed = 0;

    console.log(`[STATUS] Inicio proceso manual | mode=${mode}`);

    const targetStatuses = mode === 'ACTIVATE' ? ['PENDING', 'PAUSED'] : ['ACTIVE'];

    const megatoneStatus = mode === 'ACTIVATE' ? 1 : 2;
    const nextSyncStatus = mode === 'ACTIVATE' ? 'ACTIVE' : 'PAUSED';

    while (true) {
      const page = await this.getSyncItems.listAll(this.LIMIT, offset);

      if (!page.items.length) break;

      const candidates = page.items.filter(item => targetStatuses.includes(item.status));

      for (const item of candidates) {
        processed++;

        try {
          const result = await this.updateMegatoneStatus.bulkUpdateStatus(
            [
              {
                publicationId: Number(item.external_id),
                status: megatoneStatus
              }
            ],
            this.USER_ID
          );

          if (result.status === 'UPDATED' || result.success > 0) {
            await this.updateSyncItem.updateBySellerSku(item.seller_sku, {
              status: nextSyncStatus,
              raw: {
                source: 'manual-update-status',
                action: mode,
                megatoneStatus,
                updatedAt: new Date().toISOString()
              }
            });

            updated++;
            console.log(`[STATUS] ✔ ${mode} OK | SKU=${item.seller_sku}`);
          } else {
            failed++;
            console.log(`[STATUS] ⚠ ${mode} FAILED | SKU=${item.seller_sku} | Megatone=${result.status}`);
          }
        } catch (error) {
          failed++;
          console.log(
            `[STATUS] ✖ Error | SKU=${item.seller_sku} | ${error instanceof Error ? error.message : 'unknown'}`
          );
        }
      }

      if (!page.hasNext) break;
      offset = page.nextOffset!;
    }

    console.log('[STATUS] Fin proceso', { processed, updated, failed });

    return { processed, updated, failed };
  }
}
