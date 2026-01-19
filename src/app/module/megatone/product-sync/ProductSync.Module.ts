import { Module } from '@nestjs/common';
import { SyncMegatoneProductsInteractor } from 'src/core/interactors/megatone/product-sync/SyncMegatoneProductsInteractor';
import { ProductSyncController } from 'src/app/controller/megatone/product-sync/ProductSync.Controller';
import { MarketplaceHttpClient } from 'src/core/drivers/repositories/marketplace-api/http/MarketplaceHttpClient';
import { MadreHttpClient } from 'src/core/drivers/repositories/madre-api/http/MadreHttpClient';
import { GetMegatoneProductsRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/get/GetMegatoneProductsRepository';
import { SendBulkProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/SendBulkProductSyncRepository';
import { ProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/ProductSyncRepository';
import { GetProductSyncItemsRepository } from 'src/core/drivers/repositories/madre-api/product-sync/GetProductSyncItemsRepository';
import { UpdateProductSyncItemRepository } from 'src/core/drivers/repositories/madre-api/product-sync/UpdateProductSyncItemRepository';
import { GetMadreProductsRepository } from 'src/core/drivers/repositories/madre-api/products/get/GetMadreProductsRepository';
import { UpdateMegatoneProductsRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/update-price-stock/UpdateMegatoneProductsRepository';

@Module({
  controllers: [ProductSyncController],
  providers: [
    MarketplaceHttpClient,
    MadreHttpClient,

    {
      provide: 'IGetMegatoneProductsRepository',
      useClass: GetMegatoneProductsRepository
    },
    {
      provide: 'ISendBulkProductSyncRepository',
      useClass: SendBulkProductSyncRepository
    },
    {
      provide: 'IProductSyncRepository',
      useClass: ProductSyncRepository
    },
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
    },

    SyncMegatoneProductsInteractor
  ],
  exports: [SyncMegatoneProductsInteractor]
})
export class ProductSyncModule {}
