import { Module } from '@nestjs/common';
import { SyncMadreVsMarketplaceController } from 'src/app/controller/product-sync/SyncMadreVsMarketplace.Controller';
import { UpdatePriceAndStockService } from 'src/app/services/update-price-stock/UpdatePriceAndStockService';
import { UpdatePriceAndStock } from 'src/core/interactors/update-price-stock/UpdatePriceAndStock';
import { MarketplaceHttpClient } from 'src/core/drivers/repositories/marketplace-api/http/MarketplaceHttpClient';
import { MadreHttpClient } from 'src/core/drivers/repositories/madre-api/http/MadreHttpClient';
import { GetProductSyncItemsRepository } from 'src/core/drivers/repositories/madre-api/product-sync/GetProductSyncItemsRepository';
import { UpdateProductSyncItemRepository } from 'src/core/drivers/repositories/madre-api/product-sync/UpdateProductSyncItemRepository';
import { GetMadreProductsRepository } from 'src/core/drivers/repositories/madre-api/products/get/GetMadreProductsRepository';
import { UpdateMegatoneProductsRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/update-price-stock/UpdateMegatoneProductsRepository';

@Module({
  controllers: [SyncMadreVsMarketplaceController],
  providers: [
    UpdatePriceAndStockService,
    UpdatePriceAndStock,

    MarketplaceHttpClient,
    MadreHttpClient,

    {
      provide: 'IGetProductSyncItemsRepository',
      useClass: GetProductSyncItemsRepository
    },
    {
      provide: 'IUpdateProductSyncItemRepository',
      useClass: UpdateProductSyncItemRepository
    },
    {
      provide: 'IGetMadreProductsRepository',
      useClass: GetMadreProductsRepository
    },
    {
      provide: 'IUpdateMegatoneProductsRepository',
      useClass: UpdateMegatoneProductsRepository
    }
  ]
})
export class UpdatePriceAndStockModule {}
