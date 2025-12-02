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

// 🆕 Added RetryEngine
import { RetryCategoriesEngine } from 'src/core/interactors/categories/MatchCategories/RetryCategoriesEngine';

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
    }),
  ],

  controllers: [
    SyncCategoriesController,
    CategoriesMadreController,
    CategoriesMegatoneController,
  ],

  providers: [
    CategoriesMadreService,
    CategoriesMegatoneService,
    InMemoryCacheManager,

    // Sheets config
    { provide: 'IGoogleSheetsConfig', useClass: GoogleSheetsConfigService },
    SpreadSheetReader,

    // Products Repo
    { provide: 'ISqlProductsRepository', useClass: SQLProductRepository },

    // Match Results Sheet Repository
    {
      provide: 'IMatchCategoriesRepository',
      useClass: SheetsMatchCategoriesRepository,
    },

    // OnCity repo
    {
      provide: 'IOncityCategoriesRepository',
      useFactory: (cache: InMemoryCacheManager) =>
        new OncityCategoriesRepository(cache),
      inject: [InMemoryCacheManager],
    },

    // Megatone
    {
      provide: 'ICategoriesMegatoneRepository',
      useClass: SQLCategoriesMegatoneRepository,
    },

    {
      provide: 'ICategoriesMadreRepository',
      useClass: SQLCategoriesMadreRepository,
    },

    // OpenAI
    { provide: 'IOpenAIRepository', useClass: OpenaiMatchCategoriesRepository },

    // 🆕 Retry Engine available for controller
    RetryCategoriesEngine,
  ],
})
export class CategoriesModule {}
