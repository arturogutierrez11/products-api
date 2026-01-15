import { Module } from '@nestjs/common';
import { SyncMegatoneProductsInteractor } from 'src/core/interactors/product-sync/SyncMegatoneProductsInteractor';
import { SendBulkProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/SendBulkProductSyncRepository';
import { ProductSyncController } from 'src/app/controller/product-sync/ProductSync.Controller';
import { MarketplaceHttpClient } from 'src/core/drivers/repositories/marketplace-api/http/MarketplaceHttpClient';
import { MadreHttpClient } from 'src/core/drivers/repositories/madre-api/http/MadreHttpClient';
import { GetMegatoneProductsRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/get/GetMegatoneProductsRepository';
import { ProductSyncRepository } from 'src/core/drivers/repositories/madre-api/product-sync/ProductSyncRepository';

@Module({
  controllers: [ProductSyncController],
  providers: [
    MarketplaceHttpClient,
    MadreHttpClient,

    GetMegatoneProductsRepository,
    SendBulkProductSyncRepository,
    ProductSyncRepository,

    SyncMegatoneProductsInteractor
  ],
  exports: [SyncMegatoneProductsInteractor]
})
export class ProductSyncModule {}
