import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesMadreController } from '../controller/categorias/madre/categoriesMadre.controller';
import { SyncCategoriesController } from '../controller/categorias/sync categories/syncCategories.controller';
import { CategoriesMegatoneController } from '../controller/categorias/megatone/categoriesMegatone.controller';
import { CategoriesMadreService } from '../services/categories/madredb/CategoriesMadreService';
import { CategoriesMegatoneService } from '../services/categories/megatone/CategoriesMegatoneService';
import { SQLProductRepository } from '../drivers/repositories/SQLQuerys/madredb/products/SQLProductRepository';
import { SQLCategoriesMadreRepository } from '../drivers/repositories/SQLQuerys/madredb/categories/SQLCategoriesRepository';
import { SQLCategoriesMegatoneRepository } from '../drivers/repositories/SQLQuerys/megatone/categories/SQLCategoriesMegatoneRepository';
import { SheetsMatchCategoriesRepository } from '../drivers/repositories/categories/SheetsMatchCategoriesRepository';
import { SpreadSheetReader } from '../drivers/spreadsheets/SpreadSheetReader';
import { GoogleSheetsConfigService } from '../drivers/config/GoogleSheetsConfigService';
import { OpenaiMatchCategoriesRepository } from '../../core/drivers/repositories/openai/OpenaiMatchCategoriesReository';
import { OncityCategoriesRepository } from '../../core/drivers/repositories/oncity/categories/OncityCategoriesRepository';
import { InMemoryCacheManager } from 'src/core/drivers/cache/InMemoryCacheManager';
import { RetryCategoriesEngine } from 'src/core/interactors/categories/MatchCategories/RetryCategoriesEngine';
import { CategoriesController } from 'src/app/controller/categorias/oncity/categoriesOncity.controller';
import { SQLCategoryOncityRepository } from '../drivers/repositories/SQLQuerys/oncity/SQLCategoryOncityRepository';
import { CategoriesOncityService } from '../services/categories/oncity/CategoriesOncityService';

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

  controllers: [
    SyncCategoriesController,
    CategoriesMadreController,
    CategoriesMegatoneController,
    CategoriesController
  ],

  providers: [
    CategoriesMadreService,
    CategoriesMegatoneService,
    InMemoryCacheManager,
    CategoriesOncityService,

    { provide: 'IGoogleSheetsConfig', useClass: GoogleSheetsConfigService },
    SpreadSheetReader,

    { provide: 'ISqlProductsRepository', useClass: SQLProductRepository },

    {
      provide: 'IMatchCategoriesRepository',
      useClass: SheetsMatchCategoriesRepository
    },

    {
      provide: 'IOncityCategoriesRepository',
      useFactory: (cache: InMemoryCacheManager) => new OncityCategoriesRepository(cache),
      inject: [InMemoryCacheManager]
    },
    {
      provide: 'IMegatoneMatchCategoriesRepository',
      useClass: SQLCategoriesMegatoneRepository
    },

    {
      provide: 'ICategoriesMadreRepository',
      useClass: SQLCategoriesMadreRepository
    },

    { provide: 'IOpenAIRepository', useClass: OpenaiMatchCategoriesRepository },

    {
      provide: 'IOncityMatchCategoriesRepository',
      useClass: SQLCategoryOncityRepository
    },

    RetryCategoriesEngine
  ]
})
export class CategoriesModule {}
