import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductSyncModule } from './module/megatone/product-sync/ProductSync.Module';
import { UpdatePriceAndStockModule } from './module/megatone/update-price-stock/UpdatePriceAndStock.Module';
import { UpdateStatusModule } from './module/megatone/update-status/UpdateStatus.Module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ProductSyncModule,
    UpdatePriceAndStockModule,
    UpdateStatusModule
  ]
})
export class AppModule {}
