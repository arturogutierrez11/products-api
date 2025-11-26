import { Module } from '@nestjs/common';
import { ProductListingModule } from './module/ProductLisitng.module';
import { CategoriesModule } from './module/Categories.module';

@Module({
  imports: [ProductListingModule, CategoriesModule],
})
export class AppModule {}
