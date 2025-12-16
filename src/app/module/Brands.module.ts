import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesMadreController } from '../controller/categorias/madre/categoriesMadre.controller';
import { BrandsMadreController } from '../controller/brands/madre/brandsMadre.controller';
import { BrandMadreService } from '../services/brands/madredb/BrandsMadreService';
import { SQLBrandsRepository } from '../drivers/repositories/SQLQuerys/madredb/brands/SQLBrandsRepository';
import { BrandsMegatoneController } from '../controller/brands/megatone/brandsMegatone.controller';
import { BrandMegatoneService } from '../services/brands/megatone/BrandsMegatoneService';
import { SQLBrandsMegatoneRepository } from '../drivers/repositories/SQLQuerys/megatone/brands/SQLBrandsMegatoneRepository';

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
      synchronize: false
    })
  ],
  controllers: [BrandsMadreController, BrandsMegatoneController],
  providers: [
    BrandMadreService,
    BrandMegatoneService,

    {
      provide: 'IBrandsMadreRepository',
      useClass: SQLBrandsRepository
    },

    {
      provide: 'IBrandsMegatoneRepository',
      useClass: SQLBrandsMegatoneRepository
    }
  ]
})
export class BrandsModule {}
