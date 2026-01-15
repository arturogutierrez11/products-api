import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductSyncModule } from './module/product-sync/ProductSync.Module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ProductSyncModule
  ]
})
export class AppModule {}
