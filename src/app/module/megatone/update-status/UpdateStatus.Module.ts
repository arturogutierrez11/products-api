import { Module } from '@nestjs/common';

/* =========================
   CONTROLLER + SERVICE
========================= */
import { UpdateStatusService } from 'src/app/services/megatone/update-status/UpdateStatusService';

/* =========================
   INTERACTOR
========================= */

/* =========================
   HTTP CLIENTS
========================= */
import { MadreHttpClient } from 'src/core/drivers/repositories/madre-api/http/MadreHttpClient';
import { MarketplaceHttpClient } from 'src/core/drivers/repositories/marketplace-api/http/MarketplaceHttpClient';

/* =========================
   REPOSITORIES
========================= */
import { GetProductSyncItemsRepository } from 'src/core/drivers/repositories/madre-api/product-sync/GetProductSyncItemsRepository';
import { UpdateProductSyncItemRepository } from 'src/core/drivers/repositories/madre-api/product-sync/UpdateProductSyncItemRepository';
import { UpdateMegatoneProductStatusRepository } from 'src/core/drivers/repositories/marketplace-api/megatone/products/update-status/UpdateMegatoneProductStatusRepository';
import { UpdateStatusController } from 'src/app/controller/megatone/update-status/UpdateStatus.Controller';
import { UpdateStatus } from 'src/core/interactors/megatone/update-status/UpdateStatus';

@Module({
  controllers: [UpdateStatusController],

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
    UpdateStatus,
    UpdateStatusService
  ]
})
export class UpdateStatusModule {}
