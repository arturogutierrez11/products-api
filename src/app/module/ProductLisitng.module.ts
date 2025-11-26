import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsListingController } from '../controller/products/productsListing.controller';
import { ProductsListingService } from '../services/products/ProductsListingService';
import { SQLProductRepository } from '../drivers/repositories/SQLQuerys/SQLProductRepository';
import { SQLMarketplaceRepository } from '../drivers/repositories/SQLQuerys/SQLMarketplaceRepository';
import { SQLProductsMarketRepository } from '../drivers/repositories/SQLQuerys/SQLProductsMarketRepository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: false,
    }),
  ],
  controllers: [ProductsListingController],
  providers: [
    ProductsListingService,
    SQLProductRepository,
    SQLMarketplaceRepository,
    SQLProductsMarketRepository,
  ],
})
export class ProductListingModule {}
