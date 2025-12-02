import { Module } from '@nestjs/common';
import { ProductListingModule } from './module/ProductLisitng.module';
import { CategoriesModule } from './module/Categories.module';
import { OrdersModule } from './module/Orders.module';

@Module({
  imports: [ProductListingModule, CategoriesModule, OrdersModule],
})
export class AppModule {}
