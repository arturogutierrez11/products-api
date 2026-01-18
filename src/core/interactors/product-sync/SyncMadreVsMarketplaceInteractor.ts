import { Inject, Injectable } from '@nestjs/common';
import { IGetProductSyncItemsRepository } from 'src/core/adapters/repositories/madre/product-sync/IGetProductSyncItemsRepository';
import { IUpdateProductSyncItemRepository } from 'src/core/adapters/repositories/madre/product-sync/IUpdateProductSyncItemRepository';
import { IGetMadreProductsRepository } from 'src/core/adapters/repositories/madre/products/get/IGetMadreProductsRepository';
import { IUpdateMegatoneProductsRepository } from 'src/core/adapters/repositories/marketplace/megatone/products/update-price-stock/IUpdateMegatoneProductsRepository';

@Injectable()
export class SyncMadreVsMarketplaceInteractor {
  private readonly LIMIT = 100;

  constructor(
    @Inject('IGetProductSyncItemsRepository')
    private readonly getSyncItems: IGetProductSyncItemsRepository,

    @Inject('IGetMadreProductsRepository')
    private readonly getMadreProducts: IGetMadreProductsRepository,

    @Inject('IUpdateMegatoneProductsRepository')
    private readonly updateMegatone: IUpdateMegatoneProductsRepository,

    @Inject('IUpdateProductSyncItemRepository')
    private readonly updateSyncItem: IUpdateProductSyncItemRepository
  ) {}

  async execute(): Promise<{
    processed: number;
    updated: number;
    errors: number;
  }> {
    let offset = 0;
    let processed = 0;
    let updated = 0;
    let errors = 0;

    console.log('[SYNC] Inicio sync Madre vs Marketplace');

    while (true) {
      console.log(`[SYNC] Leyendo sync_items | offset=${offset}`);

      const page = await this.getSyncItems.listAll(this.LIMIT, offset);

      if (!page.items.length) {
        console.log('[SYNC] No hay más items para procesar');
        break;
      }

      for (const syncItem of page.items) {
        processed++;

        try {
          const changed = await this.processItem(syncItem);

          if (changed) {
            updated++;
            console.log(
              `[SYNC] ✔ Actualizado | SKU=${syncItem.seller_sku} | price=${syncItem.price} stock=${syncItem.stock}`
            );
          }
        } catch (error) {
          errors++;
          console.log(
            `[SYNC] ✖ Error | SKU=${syncItem.seller_sku} | ${error instanceof Error ? error.message : 'unknown'}`
          );
        }
      }

      if (!page.hasNext) break;
      offset = page.nextOffset!;
    }

    console.log('[SYNC] Fin sync', { processed, updated, errors });

    return { processed, updated, errors };
  }

  /* =====================================================
     PROCESO POR SKU
  ===================================================== */
  private async processItem(syncItem: {
    seller_sku: string;
    external_id: string;
    price: number;
    stock: number;
    status: string;
  }): Promise<boolean> {
    const sellerSku = syncItem.seller_sku;

    // ⛔ FIX CLAVE: NO TOCAR NADA SI EL sync_item ESTÁ DELETED
    if (syncItem.status === 'DELETED') {
      console.log(`[SYNC] ⏭ Skipping DELETED sync_item | SKU=${sellerSku}`);
      return false;
    }

    /* ---------- MADRE ---------- */
    const madreProduct = await this.getMadreProducts.getBySku(sellerSku);

    if (!madreProduct) {
      const newStatus = 'ERROR';

      console.log(`[SYNC] ⚠ No existe en Madre | SKU=${sellerSku}`);

      await this.updateSyncItem.updateBySellerSku(sellerSku, {
        status: newStatus,
        raw: {
          source: 'madre-full-sync',
          reason: 'NOT_IN_MADRE',
          checkedAt: new Date().toISOString()
        }
      });

      console.log(`[SYNC] ⚠ No existe en Madre | SKU=${sellerSku} | new status=${newStatus}`);

      return false;
    }

    const madrePrice = Number(madreProduct.price);
    const madreStock = Number(madreProduct.stock);

    const syncPrice = Number(syncItem.price);
    const syncStock = Number(syncItem.stock);

    const priceChanged = madrePrice !== syncPrice;
    const stockChanged = madreStock !== syncStock;

    if (!priceChanged && !stockChanged) {
      return false;
    }

    console.log(`[SYNC] Diferencia detectada | SKU=${sellerSku} | Madre(price=${madrePrice}, stock=${madreStock})`);

    /* ---------- MARKETPLACE (Megatone) ---------- */
    await this.updateMegatone.update({
      items: [
        {
          publicationId: Number(syncItem.external_id),
          precioLista: madrePrice,
          stock: madreStock,
          alicuotaIva: 21,
          alicuotaImpuestoInterno: 0
        }
      ]
    });

    /* ---------- MADRE (sync_item → genera history) ---------- */
    await this.updateSyncItem.updateBySellerSku(sellerSku, {
      price: madrePrice,
      stock: madreStock,
      raw: {
        source: 'madre-full-sync',
        madreUpdatedAt: madreProduct.updatedAt
      }
    });

    return true;
  }
}
