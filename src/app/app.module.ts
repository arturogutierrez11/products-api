import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductSyncModule } from './module/product-sync/ProductSync.Module';
import { UpdatePriceAndStockModule } from './module/update-price-stock/UpdatePriceAndStock.Module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ProductSyncModule,
    UpdatePriceAndStockModule
  ]
})
export class AppModule {}
