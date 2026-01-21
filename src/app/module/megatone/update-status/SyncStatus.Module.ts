import { Module } from '@nestjs/common';
import { GetProductSyncItemsRepository } from 'src/core/drivers/repositories/madre-api/product-sync/GetProductSyncItemsRepository';
import { UpdateProductSyncItemRepository } from 'src/core/drivers/repositories/madre-api/product-sync/UpdateProductSyncItemRepository';
import { UpdateMegatoneProductStatusRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/update-status/UpdateMegatoneProductStatusRepository';
import { MadreHttpClient } from 'src/core/drivers/repositories/madre-api/http/MadreHttpClient';
import { MarketplaceHttpClient } from 'src/core/drivers/repositories/marketplace-api/http/MarketplaceHttpClient';
import { SyncStatusService } from 'src/app/services/megatone/update-status/SyncStatusService';
import { SyncStatus } from 'src/core/interactors/megatone/update-status/SyncStatus';
import { SyncStatusController } from 'src/app/controller/megatone/update-status/SyncStatus.Controller';

@Module({
  controllers: [SyncStatusController],

  providers: [
    MadreHttpClient,
    MarketplaceHttpClient,
    {
      provide: 'IGetProductSyncItemsRepository',
      useClass: GetProductSyncItemsRepository
    },
    {
      provide: 'IUpdateProductSyncItemRepository',
      useClass: UpdateProductSyncItemRepository
    },
    {
      provide: 'IUpdateMegatoneProductStatusRepository',
      useClass: UpdateMegatoneProductStatusRepository
    },
    SyncStatus,
    SyncStatusService
  ]
})
export class SyncStatusModule {}
